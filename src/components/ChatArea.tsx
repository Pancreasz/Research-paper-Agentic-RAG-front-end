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
    // CHANGE 1: Added 'w-full' and 'relative' to ensure it grabs all space
    <div className="flex-1 w-full flex flex-col h-screen bg-white relative">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm flex items-center justify-between z-10">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          📂 {topic}
        </h1>
        <span className="text-xs text-gray-400 border border-gray-200 px-2 py-1 rounded-full">
          Local LLM
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 scroll-smooth">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        
        {loading && (
          <div className="flex justify-start">
             <div className="bg-gray-200 text-gray-500 text-sm px-4 py-2 rounded-2xl animate-pulse">
               Thinking...
             </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        {/* We keep max-w-4xl HERE only, so the input bar doesn't get too wide to read, 
            but the background remains full width */}
        <div className="max-w-4xl mx-auto relative flex items-center gap-2">
          <input
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none shadow-sm"
            placeholder={`Ask about ${topic}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
          />
          <button 
            onClick={onSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}