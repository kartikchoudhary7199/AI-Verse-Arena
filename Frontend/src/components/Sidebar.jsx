import {
  Sparkles,
  MessageSquarePlus,
  MessageSquare,
  Clock,
  ChevronRight,
  Zap,
  Settings,
  HelpCircle,
} from 'lucide-react';

export default function Sidebar({ chats, activeChatId, onSelectChat, onNewChat, darkMode }) {
  return (
    <aside
      className={`
        flex flex-col w-64 shrink-0 h-full border-r transition-colors duration-300
        ${darkMode
          ? 'bg-gray-950 border-gray-800'
          : 'bg-white border-gray-100'}
      `}
    >
      {/* ── Logo ─────────────────────────────── */}
      <div className={`flex items-center gap-3 px-5 py-5 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <Zap size={18} className="text-white" strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-950" />
        </div>
        <div>
          <p className={`font-semibold text-sm tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Verse Arena
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Dual AI Comparison
          </p>
        </div>
      </div>

      {/* ── New Chat CTA ─────────────────────── */}
      <div className="px-4 pt-4 pb-2">
        <button
          id="new-chat-btn"
          onClick={onNewChat}
          className={`
            w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm
            bg-gradient-to-r from-indigo-500 to-violet-600 text-white
            shadow-md shadow-indigo-500/20
            hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02]
            active:scale-[0.98]
            transition-all duration-200
          `}
        >
          <MessageSquarePlus size={16} strokeWidth={2.5} />
          New Chat
          <span className="ml-auto opacity-60 text-xs font-normal">⌘K</span>
        </button>
      </div>

      {/* ── Chat History ─────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 mt-2">
        <p className={`px-2 mb-2 text-[11px] font-semibold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Recent
        </p>
        <nav className="flex flex-col gap-0.5">
          {chats.map((chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <button
                key={chat.id}
                id={`chat-item-${chat.id}`}
                onClick={() => onSelectChat(chat.id)}
                className={`
                  group flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl
                  transition-all duration-150 cursor-pointer
                  ${isActive
                    ? darkMode
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'bg-indigo-50 text-indigo-700'
                    : darkMode
                      ? 'text-gray-400 hover:bg-gray-800/70 hover:text-gray-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <MessageSquare
                  size={14}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`shrink-0 transition-colors ${isActive ? 'text-indigo-500' : ''}`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isActive ? '' : ''}`}>
                    {chat.title}
                  </p>
                  <p className={`text-[11px] flex items-center gap-1 mt-0.5 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    <Clock size={10} />
                    {chat.timestamp}
                  </p>
                </div>
                {isActive && (
                  <ChevronRight size={13} className="shrink-0 opacity-50" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Footer actions ───────────────────── */}
      <div className={`px-3 py-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        {[
          { icon: Settings, label: 'Settings' },
          { icon: HelpCircle, label: 'Help & Support' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className={`
              flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium
              transition-colors duration-150
              ${darkMode
                ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}
            `}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
        <div className={`mt-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <div>
              <p className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Pro Plan</p>
              <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Unlimited comparisons</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
