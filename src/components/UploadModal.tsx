import { useState, useCallback } from 'react';
import { X, UploadCloud, FileText } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
}

export default function UploadModal({ isOpen, onClose, topic }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

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
      // Convert FileList to Array
      setFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const uploadFiles = async () => {
    setUploading(true);
    // Loop through files and upload one by one
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Upload to "{topic}"</h2>

        {/* Drag Drop Zone */}
        <div 
          className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadCloud size={48} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Drag & Drop files here or click to select</p>
          <input 
            type="file" 
            multiple 
            className="hidden" 
            id="fileInput"
            onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))}
          />
          <label htmlFor="fileInput" className="mt-2 text-blue-600 cursor-pointer font-medium hover:underline">
            Browse Files
          </label>
        </div>

        {/* File List Preview */}
        {files.length > 0 && (
          <div className="mt-4 max-h-32 overflow-y-auto space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm bg-gray-100 p-2 rounded">
                <FileText size={14} />
                <span className="truncate">{f.name}</span>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={uploadFiles}
          disabled={uploading || files.length === 0}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400 hover:bg-blue-700 transition"
        >
          {uploading ? "Uploading..." : `Upload ${files.length} Files`}
        </button>
      </div>
    </div>
  );
}