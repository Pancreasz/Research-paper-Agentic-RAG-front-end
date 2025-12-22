import MessageBubble from './MessageBubble';
import { Send } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface Message {
  role: string;
  content: string;
}

interface ChatAreaProps {
  topic: string;
  messages: Message[];
  input: string;
  setInput: (s: string) => void;
  onSend: () => void;
  loading: boolean;
}

export default function ChatArea({ topic, messages, input, setInput, onSend, loading }: ChatAreaProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">📂 {topic}</h1>
        <span className="text-xs text-gray-400">Powered by Local LLM</span>
      </div>

      {/* Messages - LOOK HOW CLEAN THIS IS NOW! */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        
        {loading && (
          <div className="text-center text-gray-400 text-sm animate-pulse">
            Thinking...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area (Same as before) */}
      <div className="p-4 bg-white border-t">
        <div className="max-w-4xl mx-auto relative flex items-center gap-2">
          <input
            className="w-full bg-gray-100 border-0 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
            placeholder={`Ask about ${topic}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
          />
          <button 
            onClick={onSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}