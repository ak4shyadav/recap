import { Link } from 'react-router-dom';
import { FileText, Sparkles, Clock } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-slate-700" />
            <h1 className="text-2xl font-bold text-slate-900">Recap</h1>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Turn messy notes into structured insights
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Paste your meeting notes, brain dump, or project updates. Get back organized recaps with clear action items.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold text-lg transition"
          >
            Get Started Free
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <Sparkles className="w-12 h-12 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">AI-Powered</h3>
            <p className="text-slate-600">
              Advanced analysis extracts key decisions, risks, and action items from your input.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <FileText className="w-12 h-12 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Structured Output</h3>
            <p className="text-slate-600">
              Get consistent, well-organized recaps with executive summaries and clear next steps.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <Clock className="w-12 h-12 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Save Time</h3>
            <p className="text-slate-600">
              Stop manually formatting notes. Generate professional recaps in seconds.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
