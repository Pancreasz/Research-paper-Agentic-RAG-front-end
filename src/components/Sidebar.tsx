import { Plus, Folder, Upload } from 'lucide-react'; // Install lucide-react or use text

interface SidebarProps {
  topics: string[];
  currentTopic: string;
  onSelectTopic: (t: string) => void;
  onAddTopic: () => void;
  onOpenUpload: () => void;
}

export default function Sidebar({ topics, currentTopic, onSelectTopic, onAddTopic, onOpenUpload }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen border-r border-gray-700">
      <div className="p-4 font-bold text-xl border-b border-gray-700 flex items-center gap-2">
        🤖 RAG Agent
      </div>

      {/* Topic List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onSelectTopic(topic)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              currentTopic === topic ? "bg-blue-600" : "hover:bg-gray-800"
            }`}
          >
            <Folder size={18} />
            <span className="truncate">{topic}</span>
          </button>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button 
          onClick={onOpenUpload}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 p-2 rounded text-sm border border-gray-600"
        >
          <Upload size={16} /> Upload Docs
        </button>
        <button 
          onClick={onAddTopic}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 p-2 rounded text-sm"
        >
          <Plus size={16} /> New Topic
        </button>
      </div>
    </div>
  );
}