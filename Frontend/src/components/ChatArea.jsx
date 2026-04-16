import { useEffect, useRef } from 'react';
import { User, Zap, Sparkles } from 'lucide-react';
import ResponseBlock from './ResponseBlock';

/* ── Typing indicator ───────────────────────────────────────── */
function TypingIndicator({ darkMode }) {
  return (
    <div className="flex items-start gap-3 animate-fade-in-up">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 mt-0.5">
        <Zap size={14} className="text-white" strokeWidth={2.5} />
      </div>
      <div className={`px-4 py-3 rounded-2xl rounded-tl-sm border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
      }`}>
        <div className="flex items-center gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
          <span className={`ml-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Generating solutions…
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Empty / welcome state ──────────────────────────────────── */
function WelcomeState({ darkMode, onSuggestion }) {
  const suggestions = [
    { emoji: '⚡', text: "What's the best algorithm for a nearly-sorted large dataset?" },
    { emoji: '🔀', text: 'Compare REST and GraphQL for a real-time dashboard.' },
    { emoji: '🗃️', text: 'Which database fits high-write, low-read workloads?' },
    { emoji: '⚛️', text: 'React vs Svelte for a complex SPA — which wins?' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
      {/* Hero */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
          <Zap size={34} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
          <Sparkles size={12} className="text-white" />
        </div>
      </div>

      <h2 className={`text-2xl font-bold mb-2.5 tracking-tight ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        Welcome to AI Verse Arena
      </h2>
      <p className={`text-sm max-w-sm leading-relaxed mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Ask any question. Two AI solutions are generated and judged side-by-side — so you always get the best answer.
      </p>

      {/* Suggestions */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {suggestions.map(({ emoji, text }, i) => (
          <button
            key={i}
            id={`suggestion-${i}`}
            onClick={() => onSuggestion(text)}
            className={`
              group text-left px-4 py-3.5 rounded-xl text-xs leading-relaxed border
              transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
              ${darkMode
                ? 'bg-gray-800/60 border-gray-700/80 text-gray-300 hover:border-indigo-500/50 hover:bg-gray-800 hover:shadow-lg hover:shadow-indigo-500/10'
                : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/8'}
            `}
          >
            <span className="mr-2">{emoji}</span>
            {text}
          </button>
        ))}
      </div>

      <p className={`mt-8 text-[11px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        Powered by dual AI · Judged by an AI referee
      </p>
    </div>
  );
}

/* ── Single message thread entry ────────────────────────────── */
function MessageEntry({ message, darkMode, idx }) {
  return (
    <div className="space-y-5">
      {/* User message (right-aligned) */}
      <div className="flex items-start gap-3 justify-end">
        <div
          className={`
            max-w-[62%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed
            ${darkMode
              ? 'bg-indigo-600/20 border border-indigo-500/25 text-gray-100'
              : 'bg-indigo-50 border border-indigo-100 text-gray-800 shadow-sm'}
          `}
        >
          {message.userText}
        </div>
        <div className={`
          w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border
          ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}
        `}>
          <User size={15} className={darkMode ? 'text-gray-300' : 'text-gray-500'} />
        </div>
      </div>

      {/* AI attribution row */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
          <Zap size={14} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            AI Verse Arena
          </span>
          <span className={`ml-2 text-[11px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            generated and compared both solutions
          </span>
        </div>
        <span className={`ml-auto text-[11px] px-2 py-0.5 rounded-md ${darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
          #{idx}
        </span>
      </div>

      {/* Error state */}
      {message.error && !message.response && (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-2xl border animate-fade-in-up ${
          darkMode
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-red-50 border-red-100 text-red-600'
        }`}>
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-sm font-semibold mb-0.5">Backend Error</p>
            <p className="text-xs opacity-80">{message.error}</p>
            <p className="text-xs opacity-60 mt-1">Make sure the backend is running on <code className="font-mono">http://localhost:3000</code></p>
          </div>
        </div>
      )}

      {/* Skeleton while loading response */}
      {!message.response && !message.error && (
        <div className={`space-y-3 animate-pulse rounded-2xl p-5 border ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`h-3 rounded-full w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-3 rounded-full w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-3 rounded-full w-2/3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
      )}

      {/* Full response block */}
      {message.response && (
        <ResponseBlock
          response={message.response}
          darkMode={darkMode}
          index={idx}
        />
      )}
    </div>
  );
}

/* ── ChatArea ───────────────────────────────────────────────── */
export default function ChatArea({ messages, isLoading, darkMode, onSuggestion }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return <WelcomeState darkMode={darkMode} onSuggestion={onSuggestion} />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
      {messages.map((msg, i) => (
        <MessageEntry key={msg.id} message={msg} darkMode={darkMode} idx={i + 1} />
      ))}
      {isLoading && <TypingIndicator darkMode={darkMode} />}
      <div ref={bottomRef} />
    </div>
  );
}
