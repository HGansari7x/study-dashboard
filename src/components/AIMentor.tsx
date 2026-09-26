import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2, AlertTriangle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are an expert, versatile, and highly intelligent AI mentor and assistant. You answer any query across all domains: academics, general knowledge, programming, personal productivity, and general conversation. Provide direct, structured, accurate, and comprehensive responses without filler.`;

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! Main aapka universal AI Mentor hoon. Puchiye jo man chahe—padhai, GK, coding, ya koi bhi sawal. Sabka real aur exact jawab milega.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setError(null);
    const userMessage = input.trim();
    setInput('');
    
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("Groq API Key is missing. Please check your environment variables.");
      }

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Groq API error occurred");
      }

      const reply = data.choices?.[0]?.message?.content;
      if (!reply) {
        throw new Error("Response parsing failed.");
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Kuch galat ho gaya. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] rounded-3xl border border-slate-700/50 bg-[#0b101d]/75 backdrop-blur-xl shadow-xl overflow-hidden text-slate-200">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-950/60 border border-blue-800/50 text-blue-400">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Universal AI Mentor
              <Sparkles className="h-4 w-4 text-blue-400" />
            </h2>
            <p className="text-xs text-slate-400">Your all-in-one assistant for academics, GK, and everyday queries</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900/80 text-blue-400 border border-slate-700/60 shadow-sm'
              }`}
            >
              {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-600/20'
                  : 'bg-slate-900/95 border border-slate-700/70 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900/80 text-blue-400 border border-slate-700/60 shadow-sm">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-none bg-slate-900/95 border border-slate-700/70 px-4 py-3 text-sm text-slate-400 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-2xl border border-rose-900 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-700/50 bg-slate-950/40 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything: studies, GK, coding, general questions..."
          className="flex-1 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-white font-medium transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}