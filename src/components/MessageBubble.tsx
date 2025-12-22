import { User, Bot, Copy } from 'lucide-react';

interface MessageBubbleProps {
  role: string;
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      
      {/* AI Icon (Only show on left if it's AI) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200 flex-shrink-0">
          <Bot size={18} className="text-green-700" />
        </div>
      )}

      {/* The Bubble */}
      <div className={`group relative max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
        isUser 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
      }`}>
        {/* Message Content */}
        <div className="whitespace-pre-wrap">{content}</div>
        
        {/* Optional: Tiny Copy Button that appears on hover */}
        {!isUser && (
           <button 
             onClick={() => navigator.clipboard.writeText(content)}
             className="absolute -bottom-6 left-0 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-blue-600"
           >
             <Copy size={12} /> Copy
           </button>
        )}
      </div>

      {/* User Icon (Only show on right if it's User) */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 flex-shrink-0">
          <User size={18} className="text-blue-700" />
        </div>
      )}
    </div>
  );
}