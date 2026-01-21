import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FileText, LogOut, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateRecap, RecapOutput } from '../lib/ai';
import { supabase } from '../lib/supabase';

export function App() {
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState<RecapOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState<number | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const { signOut } = useAuth();

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!data) {
      await supabase.from('usage').insert([{ user_id: user.id }]);
      setRemaining(3);
      return;
    }

    if (data.last_reset !== today) {
      await supabase
        .from('usage')
        .update({ daily_count: 0, last_reset: today })
        .eq('user_id', user.id);

      setRemaining(3);
      return;
    }

    setRemaining(3 - data.daily_count);
  };

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (remaining !== null && remaining <= 0) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError('');
    setOutput(null);

    try {
      const result = await generateRecap(inputText);
      setOutput(result);

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('recaps').insert([
          {
            user_id: user.id,
            input_text: inputText,
            executive_summary: result.executiveSummary,
            key_highlights: JSON.stringify(result.keyHighlights),
            decisions_taken: JSON.stringify(result.decisionsTaken),
            risks_blockers: JSON.stringify(result.risksAndBlockers),
            action_items: JSON.stringify(result.actionItems),
            next_steps: JSON.stringify(result.nextSteps)
          }
        ] as any);

        await supabase.rpc('increment_usage', { uid: user.id });

        setRemaining((r) => (r !== null ? r - 1 : r));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate recap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">Recap</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/history"
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition"
            >
              <Clock className="w-5 h-5" />
              History
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleGenerate} className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {remaining !== null && (
              <p className="text-sm text-slate-500 mb-2">
                {remaining} free recaps left today
              </p>
            )}

            <label className="block text-lg font-semibold text-slate-900 mb-3">
              Enter your notes or meeting transcript
            </label>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your meeting notes, project updates, or brain dump here..."
              className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none transition"
              disabled={loading}
            />

            {error && (
              <div className="mt-3 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Generating...' : 'Generate Recap'}
            </button>
          </div>
        </form>

        {output && (
          <div className="space-y-6">
            <Section title="Executive Summary">
              <p>{output.executiveSummary}</p>
            </Section>

            <ListSection title="Key Highlights" items={output.keyHighlights} />
            <ListSection title="Decisions Taken" items={output.decisionsTaken} />
            <ListSection title="Risks & Blockers" items={output.risksAndBlockers} />
            <ListSection
              title="Action Items"
              items={output.actionItems.map(
                (a) => `${a.task} — ${a.owner} (${a.priority})`
              )}
            />
            <ListSection title="Next Steps" items={output.nextSteps} />
          </div>
        )}
      </main>

      {showPaywall && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-2">Free limit reached</h2>
            <p className="text-slate-600 mb-4">
              You’ve used all 3 free recaps for today. Upgrade to Pro for unlimited access.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaywall(false)}
                className="flex-1 px-4 py-2 rounded-lg border"
              >
                Close
              </button>

              <button
                className="flex-1 px-4 py-2 rounded-lg bg-slate-900 text-white"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
      <div className="text-slate-700">{children}</div>
    </div>
  );
}

function ListSection({ title, items }: any) {
  if (!items || !items.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
      <ul className="space-y-2">
        {items.map((item: string, idx: number) => (
          <li key={idx} className="flex gap-3 text-slate-700">
            <span className="text-slate-400 font-medium">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
