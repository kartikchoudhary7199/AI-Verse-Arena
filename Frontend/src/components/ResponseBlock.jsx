import ReactMarkdown from 'react-markdown';
import {
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  BookOpen,
  Scale,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

/* ── Score bar ──────────────────────────────────────────────────────── */
function ScoreBar({ score, max = 10, color }) {
  const pct = (score / max) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-sm font-bold tabular-nums ${color.replace('bg-', 'text-')}`}>
        {score}/{max}
      </span>
    </div>
  );
}

/* ── Solution card ──────────────────────────────────────────────────── */
function SolutionCard({ title, content, score, isWinner, colorClass, darkMode, index }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={`
        flex flex-col rounded-2xl border overflow-hidden
        transition-all duration-300
        ${isWinner
          ? darkMode
            ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/10'
            : 'border-indigo-200 shadow-lg shadow-indigo-500/8'
          : darkMode
            ? 'border-gray-700/60'
            : 'border-gray-200'}
      `}
    >
      {/* Card header */}
      <div
        className={`
          flex items-center justify-between px-4 py-3 border-b
          ${darkMode ? 'border-gray-700/60 bg-gray-800/40' : 'border-gray-100 bg-gray-50/80'}
        `}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold ${colorClass.replace('text-', 'bg-').split(' ')[0]}`}>
            {index}
          </div>
          <span className={`font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {title}
          </span>
          {isWinner && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Trophy size={10} strokeWidth={2.5} />
              Winner
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            Score: {score}/10
          </span>
          <button
            onClick={() => setExpanded(v => !v)}
            className={`p-1 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-500' : 'hover:bg-gray-200 text-gray-400'}`}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Markdown content */}
      {expanded && (
        <div
          className={`
            flex-1 px-5 py-4 overflow-y-auto max-h-80
            prose-response
            ${darkMode ? 'text-gray-300' : 'text-gray-700'}
          `}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

/* ── Judge section ──────────────────────────────────────────────────── */
function JudgeSection({ judge, darkMode }) {
  const s1 = judge.solution_1_score;
  const s2 = judge.solution_2_score;
  const winner = s1 >= s2 ? 1 : 2;

  return (
    <div
      className={`
        rounded-2xl border overflow-hidden
        ${darkMode
          ? 'border-violet-500/30 bg-violet-500/5'
          : 'border-violet-200 bg-violet-50/60'}
      `}
    >
      {/* Judge header */}
      <div
        className={`
          flex items-center gap-2.5 px-5 py-3.5 border-b
          ${darkMode ? 'border-violet-500/20' : 'border-violet-100'}
        `}
      >
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/25">
          <Scale size={14} className="text-white" />
        </div>
        <span className={`font-semibold text-sm ${darkMode ? 'text-violet-300' : 'text-violet-800'}`}>
          Judge Evaluation
        </span>
        <span className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full
          ${darkMode ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>
          AI Referee
        </span>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Score comparison */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Score Comparison
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className={`text-xs font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Solution 1</span>
              </div>
              <ScoreBar score={s1} color="bg-indigo-500" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className={`text-xs font-medium ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>Solution 2</span>
              </div>
              <ScoreBar score={s2} color="bg-violet-500" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t ${darkMode ? 'border-violet-500/15' : 'border-violet-100'}`} />

        {/* Reasoning */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Solution 1 Reasoning', text: judge.solution_1_reasoning, icon: CheckCircle2, color: 'text-indigo-500' },
            { label: 'Solution 2 Reasoning', text: judge.solution_2_reasoning, icon: XCircle, color: 'text-violet-500' },
          ].map(({ label, text, icon: Icon, color }) => (
            <div key={label}>
              <div className={`flex items-center gap-1.5 mb-2`}>
                <Icon size={13} className={color} />
                <p className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</p>
              </div>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{text}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className={`border-t ${darkMode ? 'border-violet-500/15' : 'border-violet-100'}`} />

        {/* Final verdict */}
        <div
          className={`
            flex items-center gap-4 px-4 py-3 rounded-xl
            ${darkMode
              ? 'bg-emerald-500/8 border border-emerald-500/20'
              : 'bg-emerald-50 border border-emerald-100'}
          `}
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Trophy size={18} className="text-emerald-500" />
          </div>
          <div className="flex-1">
            <p className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Final Verdict
            </p>
            <p className={`text-sm font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Solution {winner} is Recommended
            </p>
          </div>
          <span className={`
            px-3 py-1.5 rounded-full text-xs font-bold tracking-wide
            bg-emerald-500 text-white shadow-md shadow-emerald-500/25
          `}>
            ✓ Best Pick
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main ResponseBlock ─────────────────────────────────────────────── */
export default function ResponseBlock({ response, darkMode, index }) {
  const { problem, solution_1, solution_2, judge } = response;
  const s1Score = judge.solution_1_score;
  const s2Score = judge.solution_2_score;

  return (
    <div className="animate-fade-in-up space-y-4">
      {/* ── Problem card ── */}
      <div
        className={`
          rounded-2xl border px-5 py-4
          ${darkMode
            ? 'bg-gray-800/50 border-gray-700/60'
            : 'bg-amber-50/60 border-amber-100'}
        `}
      >
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={14} className={darkMode ? 'text-amber-400' : 'text-amber-600'} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
            Problem
          </span>
        </div>
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {problem}
        </p>
      </div>

      {/* ── Solutions side by side ── */}
      <div className="grid grid-cols-2 gap-4">
        <SolutionCard
          title="Solution 1"
          content={solution_1}
          score={s1Score}
          isWinner={s1Score >= s2Score}
          colorClass="text-indigo-500 bg-indigo-500"
          darkMode={darkMode}
          index={1}
        />
        <SolutionCard
          title="Solution 2"
          content={solution_2}
          score={s2Score}
          isWinner={s2Score > s1Score}
          colorClass="text-violet-500 bg-violet-500"
          darkMode={darkMode}
          index={2}
        />
      </div>

      {/* ── Judge section ── */}
      <JudgeSection judge={judge} darkMode={darkMode} />
    </div>
  );
}
