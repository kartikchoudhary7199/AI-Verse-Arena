import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatArea from '../components/ChatArea';
import InputBar from '../components/InputBar';
import { MOCK_CHATS, DEMO_RESPONSE } from '../data/mockData';

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
  // Backend returns: { message, success, result }
  // result shape: { problem, solution_1, solution_2, judge: { ... } }
  return data.result;
}

/* ── Seed demo messages for a chat ─────────────────────────── */
function buildDemoMessages(chatId) {
  return [
    {
      id: `demo-${chatId}`,
      userText: DEMO_RESPONSE.problem,
      response: DEMO_RESPONSE,
    },
  ];
}

export default function App() {
  /* ── State ────────────────────────────────────────────────── */
  const [darkMode, setDarkMode] = useState(true);

  // chatStore: { [chatId]: { title, timestamp, messages[] } }
  const [chatStore, setChatStore] = useState(() => {
    const store = {};
    MOCK_CHATS.forEach((c) => {
      store[c.id] = { title: c.title, timestamp: c.timestamp, messages: buildDemoMessages(c.id) };
    });
    return store;
  });

  const [chatOrder, setChatOrder] = useState(MOCK_CHATS.map((c) => c.id));
  const [activeChatId, setActiveChatId] = useState('c1');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /* ── Sync dark class on <html> ──────────────────────────── */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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
      // Mark the message as errored so the skeleton clears
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
    const id = `c-new-${Date.now()}`;
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
        ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'}
      `}
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
    </div>
  );
}
