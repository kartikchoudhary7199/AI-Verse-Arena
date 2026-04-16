import { Pencil, Trash2, Share2, Sun, Moon } from 'lucide-react';

export default function Header({ 
  title, 
  darkMode, 
  onToggleDark,
  onDelete,
  onRename,
  onShare
}) {
  return (
    <header
      className={`
        shrink-0 flex items-center justify-between
        px-6 py-3.5 border-b backdrop-blur-sm
        transition-colors duration-300
        ${darkMode
          ? 'bg-gray-950/90 border-gray-800'
          : 'bg-white/90 border-gray-100'}\n      `}
    >
      {/* Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse`} />
        <h1
          className={`font-semibold text-sm truncate ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
        >
          {title}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 ml-4">
        {[
          { icon: Share2, label: 'Share', id: 'header-share', onClick: onShare },
          { icon: Pencil, label: 'Rename', id: 'header-rename', onClick: onRename },
          { icon: Trash2, label: 'Delete', id: 'header-delete', onClick: onDelete },
        ].map(({ icon: Icon, label, id, onClick }) => (
          <button
            key={id}
            id={id}
            title={label}
            onClick={onClick}
            className={`
              p-2 rounded-lg transition-all duration-150
              ${darkMode
                ? 'text-gray-500 hover:text-gray-200 hover:bg-gray-800 active:bg-gray-700'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'}\n            `}
          >
            <Icon size={15} />
          </button>
        ))}\n
        {/* Divider */}
        <div className={`w-px h-5 mx-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />

        {/* Dark mode toggle */}
        <button
          id="toggle-dark-mode"
          onClick={onToggleDark}
          title="Toggle dark mode"
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
            transition-all duration-200
            ${darkMode
              ? 'bg-gray-800 text-amber-400 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\n          `}
        >
          {darkMode
            ? <><Sun size={13} strokeWidth={2.5} /> Light</>
            : <><Moon size={13} strokeWidth={2.5} /> Dark</>
          }
        </button>
      </div>
    </header>
  );
}