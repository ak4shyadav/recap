import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, LogOut, ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Recap } from '../types/database';

export function History() {
  const [recaps, setRecaps] = useState<Recap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecap, setSelectedRecap] = useState<Recap | null>(null);
  const { signOut } = useAuth();

  useEffect(() => {
    loadRecaps();
  }, []);

  const loadRecaps = async () => {
    try {
      const { data, error } = await supabase
        .from('recaps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecaps(data || []);
    } catch (err) {
      console.error('Error loading recaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecap = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recap?')) return;

    try {
      const { error } = await supabase
        .from('recaps')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecaps(recaps.filter(r => r.id !== id));
      if (selectedRecap?.id === id) {
        setSelectedRecap(null);
      }
    } catch (err) {
      console.error('Error deleting recap:', err);
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
              to="/app"
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to App
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Your Recap History</h2>

        {loading ? (
          <div className="text-center text-slate-600 py-12">Loading...</div>
        ) : recaps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-slate-600 mb-4">No recaps yet</p>
            <Link
              to="/app"
              className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold transition"
            >
              Create your first recap
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              {recaps.map((recap) => (
                <button
                  key={recap.id}
                  onClick={() => setSelectedRecap(recap)}
                  className={`w-full text-left bg-white rounded-lg p-4 transition ${
                    selectedRecap?.id === recap.id
                      ? 'ring-2 ring-slate-900 shadow-md'
                      : 'hover:shadow-md'
                  }`}
                >
                  <p className="text-sm text-slate-500 mb-1">
                    {new Date(recap.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-slate-900 font-medium line-clamp-2">
                    {recap.input_text}
                  </p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedRecap ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Original Input</h3>
                      <button
                        onClick={() => deleteRecap(selectedRecap.id)}
                        className="text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{selectedRecap.input_text}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Executive Summary</h3>
                    <p className="text-slate-700">{selectedRecap.executive_summary}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Key Highlights</h3>
                    <ul className="space-y-2">
                      {selectedRecap.key_highlights.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-700">
                          <span className="text-slate-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Decisions Taken</h3>
                    <ul className="space-y-2">
                      {selectedRecap.decisions_taken.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-700">
                          <span className="text-slate-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Risks & Blockers</h3>
                    <ul className="space-y-2">
                      {selectedRecap.risks_blockers.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-700">
                          <span className="text-slate-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Action Items</h3>
                    <ul className="space-y-2">
                      {selectedRecap.action_items.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-700">
                          <span className="text-slate-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Next Steps</h3>
                    <ul className="space-y-2">
                      {selectedRecap.next_steps.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-700">
                          <span className="text-slate-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <p className="text-slate-600">Select a recap to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
