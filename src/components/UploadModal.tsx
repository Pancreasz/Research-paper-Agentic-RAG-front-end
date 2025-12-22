import { useState, useCallback } from 'react';
import { X, Upload, FileText } from 'lucide-react'; 

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
}

export default function UploadModal({ isOpen, onClose, topic }: UploadModalProps) {
  // 1. ALWAYS call hooks at the top level
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const uploadFiles = async () => {
    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append('data', file);
      formData.append('topic', topic);

      try {
        await fetch('/api/n8n/upload-pdf', { method: 'POST', body: formData });
      } catch (err) {
        console.error("Failed to upload", file.name, err);
      }
    }
    setUploading(false);
    setFiles([]);
    alert("Upload Complete!");
    onClose();
  };

  // 2. NOW you can conditionally render.
  // The hooks above have already run, so React is happy.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative m-4">
        
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">Upload to "{topic}"</h2>

        <div 
          className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all ${
            dragActive 
              ? "border-blue-500 bg-blue-50 scale-105" 
              : "border-gray-300 bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload size={40} className={`mb-2 ${dragActive ? "text-blue-500" : "text-gray-400"}`} />
          <p className="text-sm text-gray-500 font-medium">Drag & Drop files here</p>
          
          <input 
            type="file" 
            multiple 
            className="hidden" 
            id="fileInput"
            onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))}
          />
          <label 
            htmlFor="fileInput" 
            className="mt-2 text-blue-600 cursor-pointer text-sm font-semibold hover:underline"
          >
            Browse Files
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-4 max-h-32 overflow-y-auto space-y-2 border-t pt-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm bg-gray-100 p-2 rounded text-gray-700">
                <FileText size={14} />
                <span className="truncate">{f.name}</span>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={uploadFiles}
          disabled={uploading || files.length === 0}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-300 hover:bg-blue-700 transition shadow-lg active:scale-95"
        >
          {uploading ? "Uploading..." : `Upload ${files.length} Files`}
        </button>
      </div>
    </div>
  );
}