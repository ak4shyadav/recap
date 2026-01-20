import { useState, FormEvent } from 'react';
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
  const { signOut } = useAuth();

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError('');
    setOutput(null);

    try {
      const result = await generateRecap(inputText);
      setOutput(result);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('recaps').insert({
          user_id: user.id,
          input_text: inputText,
          executive_summary: result.executive_summary,
          key_highlights: result.key_highlights,
          decisions_taken: result.decisions_taken,
          risks_blockers: result.risks_blockers,
          action_items: result.action_items,
          next_steps: result.next_steps
        });
      }
    } catch (err) {
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
            <label htmlFor="input" className="block text-lg font-semibold text-slate-900 mb-3">
              Enter your notes or meeting transcript
            </label>
            <textarea
              id="input"
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Executive Summary</h2>
              <p className="text-slate-700 leading-relaxed">{output.executive_summary}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Key Highlights</h2>
              <ul className="space-y-2">
                {output.key_highlights.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700">
                    <span className="text-slate-400 font-medium">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Decisions Taken</h2>
              <ul className="space-y-2">
                {output.decisions_taken.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700">
                    <span className="text-slate-400 font-medium">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Risks & Blockers</h2>
              <ul className="space-y-2">
                {output.risks_blockers.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700">
                    <span className="text-slate-400 font-medium">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Action Items</h2>
              <ul className="space-y-2">
                {output.action_items.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700">
                    <span className="text-slate-400 font-medium">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Next Steps</h2>
              <ul className="space-y-2">
                {output.next_steps.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700">
                    <span className="text-slate-400 font-medium">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
