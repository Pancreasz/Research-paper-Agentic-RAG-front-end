import { Plus, Folder, Upload, Trash2 } from 'lucide-react';

interface SidebarProps {
  topics: string[];
  currentTopic: string;
  onSelectTopic: (t: string) => void;
  onAddTopic: () => void;
  onOpenUpload: () => void;
  onDeleteTopic: (t: string) => void;
}

export default function Sidebar({ 
  topics, 
  currentTopic, 
  onSelectTopic, 
  onAddTopic, 
  onOpenUpload, 
  onDeleteTopic 
}: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen border-r border-gray-700">
      <div className="p-4 font-bold text-xl border-b border-gray-700 flex items-center gap-2">
        🤖 RAG Agent
      </div>

      {/* Topic List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {topics.map((topic) => (
          <div key={topic} className="relative group"> {/* 'group' allows child to react to parent hover */}
            <button
              onClick={() => onSelectTopic(topic)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                currentTopic === topic ? "bg-blue-600" : "hover:bg-gray-800"
              }`}
            >
              <Folder size={18} />
              <span className="truncate pr-8">{topic}</span>
            </button>

            {/* Delete Icon - Hidden by default (opacity-0), visible on hover (group-hover:opacity-100) */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents clicking the topic itself
                onDeleteTopic(topic);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete Topic"
            >
              <Trash2 size={16} />
            </button>
          </div>
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