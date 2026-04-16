import { Send, Paperclip, Mic } from 'lucide-react';

export default function InputBar({ value, onChange, onSend, isLoading, darkMode }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className={`
        shrink-0 px-6 py-4 border-t backdrop-blur-sm transition-colors duration-300
        ${darkMode ? 'bg-gray-950/90 border-gray-800' : 'bg-white/90 border-gray-100'}
      `}
    >
      <div
        className={`
          flex items-end gap-3 rounded-2xl px-4 py-3
          border transition-all duration-200
          ${darkMode
            ? 'bg-gray-900 border-gray-700 focus-within:border-indigo-500/60 focus-within:shadow-lg focus-within:shadow-indigo-500/10'
            : 'bg-gray-50 border-gray-200 focus-within:border-indigo-300 focus-within:shadow-lg focus-within:shadow-indigo-500/8 focus-within:bg-white'}
        `}
      >
        {/* Attachment */}
        <button
          id="attach-btn"
          title="Attach file"
          className={`
            shrink-0 p-1.5 rounded-lg mb-0.5 transition-colors duration-150
            ${darkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'}
          `}
        >
          <Paperclip size={17} />
        </button>

        {/* Textarea */}
        <textarea
          id="chat-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything — get two AI solutions compared side by side…"
          rows={1}
          disabled={isLoading}
          className={`
            flex-1 resize-none bg-transparent text-sm outline-none
            placeholder:text-gray-400 leading-relaxed
            max-h-40 overflow-y-auto
            transition-colors duration-150
            ${darkMode ? 'text-gray-100' : 'text-gray-800'}
            disabled:opacity-50
          `}
          style={{ fieldSizing: 'content' }}
        />

        {/* Mic */}
        <button
          id="mic-btn"
          title="Voice input"
          className={`
            shrink-0 p-1.5 rounded-lg mb-0.5 transition-colors duration-150
            ${darkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'}
          `}
        >
          <Mic size={17} />
        </button>

        {/* Send */}
        <button
          id="send-btn"
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          className={`
            shrink-0 flex items-center justify-center
            w-9 h-9 rounded-xl mb-0.5
            font-medium transition-all duration-200
            ${value.trim() && !isLoading
              ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:scale-105 active:scale-95'
              : darkMode
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          {isLoading
            ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            : <Send size={15} strokeWidth={2.5} />
          }
        </button>
      </div>

      <p className={`mt-2 text-center text-[11px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        Press <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>Enter</kbd> to send &nbsp;·&nbsp;
        <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
