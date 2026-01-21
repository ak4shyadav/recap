import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, LogOut, ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function safeParse(value: any, fallback: any) {
  try {
    if (typeof value === 'string') return JSON.parse(value);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function History() {
  const [recaps, setRecaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecap, setSelectedRecap] = useState<any | null>(null);
  const { signOut } = useAuth();

  useEffect(() => {
    loadRecaps();
  }, []);

  const loadRecaps = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('recaps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const parsed = (data || []).map((r) => ({
        ...r,
        key_highlights: safeParse(r.key_highlights, []),
        decisions_taken: safeParse(r.decisions_taken, []),
        risks_blockers: safeParse(r.risks_blockers, []),
        action_items: safeParse(r.action_items, []),
        next_steps: safeParse(r.next_steps, [])
      }));

      setRecaps(parsed);
    } catch (err) {
      console.error('Error loading recaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecap = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recap?')) return;

    try {
      const { error } = await supabase.from('recaps').delete().eq('id', id);
      if (error) throw error;

      setRecaps(recaps.filter((r) => r.id !== id));
      if (selectedRecap?.id === id) setSelectedRecap(null);
    } catch (err) {
      console.error('Error deleting recap:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-slate-700" />
            <h1 className="text-2xl font-bold">Recap</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/app" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to App
            </Link>
            <button onClick={() => signOut()} className="flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Your Recap History</h2>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : recaps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="mb-4">No recaps yet</p>
            <Link to="/app" className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg">
              Create your first recap
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              {recaps.map((recap) => (
                <button
                  key={recap.id}
                  onClick={() => setSelectedRecap(recap)}
                  className="w-full text-left bg-white rounded-lg p-4 hover:shadow-md"
                >
                  <p className="text-sm text-slate-500 mb-1">
                    {new Date(recap.created_at).toLocaleString()}
                  </p>
                  <p className="font-medium line-clamp-2">{recap.input_text}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedRecap ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-semibold">Original Input</h3>
                      <button onClick={() => deleteRecap(selectedRecap.id)} className="text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="whitespace-pre-wrap">{selectedRecap.input_text}</p>
                  </div>

                  <Detail title="Executive Summary" items={[selectedRecap.executive_summary]} />
                  <Detail title="Key Highlights" items={selectedRecap.key_highlights} />
                  <Detail title="Decisions Taken" items={selectedRecap.decisions_taken} />
                  <Detail title="Risks & Blockers" items={selectedRecap.risks_blockers} />
                  <Detail
                    title="Action Items"
                    items={selectedRecap.action_items.map(
                      (a: any) => `${a.task} — ${a.owner} (${a.priority})`
                    )}
                  />
                  <Detail title="Next Steps" items={selectedRecap.next_steps} />
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center">
                  Select a recap to view details
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Detail({ title, items }: any) {
  if (!items || !items.length) return null;

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item: string, idx: number) => (
          <li key={idx} className="flex gap-2">
            <span>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
