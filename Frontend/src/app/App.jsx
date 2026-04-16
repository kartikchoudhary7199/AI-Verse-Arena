import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatArea from '../components/ChatArea';
import InputBar from '../components/InputBar';

/* ── Real API call → POST http://localhost:3000/invoke ─────── */
async function callBackendApi(prompt) {
  const res = await fetch('http://localhost:3000/invoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: prompt }),
  });

  if (!res.ok) {
    throw new Error(`Backend error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.result;
}

export default function App() {
  /* ── State ────────────────────────────────────────────────── */
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('ai-verse-dark-mode');
    return saved ? JSON.parse(saved) : true;
  });

  // chatStore: { [chatId]: { title, timestamp, messages[] } }
  const [chatStore, setChatStore] = useState(() => {
    const saved = localStorage.getItem('ai-verse-chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved chats:', e);
      }
    }
    return {};
  });

  const [chatOrder, setChatOrder] = useState(() => {
    const saved = localStorage.getItem('ai-verse-chat-order');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load chat order:', e);
      }
    }
    return [];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = localStorage.getItem('ai-verse-active-chat');
    return saved ? JSON.parse(saved) : null;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameText, setRenameText] = useState('');

  /* ── Sync dark mode ────────────────────────────────────── */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ai-verse-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  /* ── Sync chat store ────────────────────────────────────── */
  useEffect(() => {
    localStorage.setItem('ai-verse-chats', JSON.stringify(chatStore));
  }, [chatStore]);

  /* ── Sync chat order ────────────────────────────────────── */
  useEffect(() => {
    localStorage.setItem('ai-verse-chat-order', JSON.stringify(chatOrder));
  }, [chatOrder]);

  /* ── Sync active chat ────────────────────────────────────– */
  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem('ai-verse-active-chat', JSON.stringify(activeChatId));
    }
  }, [activeChatId]);

  /* ── Derived helpers ────────────────────────────────────── */
  const activeChat = chatStore[activeChatId] ?? { title: 'New Chat', timestamp: '', messages: [] };
  const sidebarChats = chatOrder.map((id) => ({
    id,
    title: chatStore[id]?.title ?? 'Chat',
    timestamp: chatStore[id]?.timestamp ?? '',
  }));

  /* ── Handle suggestion chip click ──────────────────────── */
  const handleSuggestion = useCallback((text) => {
    setInput(text);
  }, []);

  /* ── Send message ───────────────────────────────────────── */
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const msgId = `msg-${Date.now()}`;
    const newMsg = { id: msgId, userText: text, response: null };

    // Optimistically add the user message
    setChatStore((prev) => ({
      ...prev,
      [activeChatId]: {
        ...prev[activeChatId],
        title: text.length > 42 ? text.slice(0, 42) + '…' : text,
        timestamp: 'Just now',
        messages: [...(prev[activeChatId]?.messages ?? []), newMsg],
      },
    }));
    setInput('');
    setIsLoading(true);

    try {
      const response = await callBackendApi(text);
      setChatStore((prev) => ({
        ...prev,
        [activeChatId]: {
          ...prev[activeChatId],
          messages: prev[activeChatId].messages.map((m) =>
            m.id === msgId ? { ...m, response } : m
          ),
        },
      }));
    } catch (err) {
      console.error('[AI Verse Arena] Backend call failed:', err);
      setChatStore((prev) => ({
        ...prev,
        [activeChatId]: {
          ...prev[activeChatId],
          messages: prev[activeChatId].messages.map((m) =>
            m.id === msgId ? { ...m, error: err.message } : m
          ),
        },
      }));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, activeChatId]);

  /* ── New chat ───────────────────────────────────────────── */
  const handleNewChat = useCallback(() => {
    const id = `c-${Date.now()}`;
    setChatStore((prev) => ({
      ...prev,
      [id]: { title: 'New Chat', timestamp: 'Just now', messages: [] },
    }));
    setChatOrder((prev) => [id, ...prev]);
    setActiveChatId(id);
    setInput('');
  }, []);

  /* ── Select chat ────────────────────────────────────────── */
  const handleSelectChat = useCallback((id) => {
    setActiveChatId(id);
    setInput('');
  }, []);

  /* ── Delete chat ────────────────────────────────────────── */
  const handleDeleteChat = useCallback(() => {
    setChatStore((prev) => {
      const newStore = { ...prev };
      delete newStore[activeChatId];
      return newStore;
    });
    setChatOrder((prev) => prev.filter((id) => id !== activeChatId));
    
    // Switch to the next chat or create new one
    const nextChatId = chatOrder.find((id) => id !== activeChatId);
    if (nextChatId) {
      setActiveChatId(nextChatId);
    } else {
      handleNewChat();
    }
    setShowDeleteModal(false);
  }, [activeChatId, chatOrder, handleNewChat]);

  /* ── Rename chat ────────────────────────────────────────── */
  const handleRenameChat = useCallback(() => {
    if (!renameText.trim()) return;
    
    setChatStore((prev) => ({
      ...prev,
      [activeChatId]: {
        ...prev[activeChatId],
        title: renameText.trim(),
      },
    }));
    setShowRenameModal(false);
    setRenameText('');
  }, [activeChatId, renameText]);

  /* ── Share chat ────────────────────────────────────────── */
  const handleShareChat = useCallback(() => {
    const chat = activeChat;
    if (!chat || chat.messages.length === 0) {
      alert('No content to share');
      return;
    }

    // Create shareable text format
    let shareText = `${chat.title}\n\n`;
    chat.messages.forEach((msg) => {
      shareText += `Q: ${msg.userText}\n\n`;
      if (msg.response) {
        shareText += `Solution 1:\n${msg.response.solution_1}\n\n`;
        shareText += `Solution 2:\n${msg.response.solution_2}\n\n`;
        if (msg.response.judge) {
          shareText += `Judge's Verdict:\nSolution 1: ${msg.response.judge.solution_1_score}/10\nSolution 2: ${msg.response.judge.solution_2_score}/10\n\n`;
        }
      }
      shareText += '---\n\n';
    });

    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Chat copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    });
  }, [activeChat]);

  /* ── Header title ───────────────────────────────────────── */
  const msgs = activeChat.messages;
  const headerTitle =
    msgs.length > 0
      ? msgs[0].userText.slice(0, 72) + (msgs[0].userText.length > 72 ? '…' : '')
      : activeChat.title ?? 'New Chat';

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div
      className={`
        flex h-screen w-screen overflow-hidden
        transition-colors duration-300
        ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'}\n      `}
    >
      {/* Left sidebar */}
      <Sidebar
        chats={sidebarChats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        darkMode={darkMode}
      />

      {/* Main panel */}
      <main className="flex flex-col flex-1 min-w-0 h-full">
        <Header
          title={headerTitle}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          onDelete={() => setShowDeleteModal(true)}
          onRename={() => {
            setRenameText(activeChat.title);
            setShowRenameModal(true);
          }}
          onShare={handleShareChat}
        />

        <ChatArea
          messages={activeChat.messages}
          isLoading={isLoading}
          darkMode={darkMode}
          onSuggestion={handleSuggestion}
        />

        <InputBar
          value={input}
          onChange={setInput}
          onSend={handleSend}
          isLoading={isLoading}
          darkMode={darkMode}
        />
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`rounded-2xl p-6 max-w-sm shadow-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-2">Delete Chat?</h3>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              This action cannot be undone. All messages in this chat will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChat}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`rounded-2xl p-6 max-w-sm shadow-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4">Rename Chat</h3>
            <input
              type="text"
              value={renameText}
              onChange={(e) => setRenameText(e.target.value)}
              placeholder="Enter new chat name..."
              className={`w-full px-4 py-2 rounded-lg text-sm mb-6 outline-none border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 focus:border-indigo-500' : 'bg-white border-gray-200 focus:border-indigo-400'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameChat();
              }}
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRenameModal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleRenameChat}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}