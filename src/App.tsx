import { useState } from 'react';

export default function App() {
  const [topic, setTopic] = useState("ear-biometrics"); // Default topic
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // 1. Upload File with Topic Tag
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('data', file); // The file binary
    formData.append('topic', topic); // The "Folder" tag

    // Calls /api/n8n/upload-paper -> Proxies to n8n Webhook
    await fetch('/api/n8n/upload-pdf', {
      method: 'POST',
      body: formData,
    });
    alert("File uploaded to topic: " + topic);
  };

  // 2. Chat with Context Filter
  const handleChat = async () => {
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput(""); // Clear input box for better UX

    try {
        const response = await fetch('/api/n8n/chat-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chatInput: input,
            topic: topic, 
            sessionId: "user-session-2"
          })
        });

        const data = await response.json();
        
        // DEBUGGING: Check the console to see the real structure
        console.log("n8n Response:", data); 

        // FIX: Access the first item in the array [0]
        const aiText = data.output || "No response received";
        
        setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
    } catch (error) {
        console.error("Chat error:", error);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      {/* SECTION 3: TOPIC SELECTION */}
      <div className="mb-6 bg-gray-100 p-4 rounded">
        <label className="block font-bold mb-2">Select Research Topic (Folder)</label>
        <select 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="ear-biometrics">Ear Biometrics</option>
          <option value="yolo-models">YOLO Models</option>
          <option value="startup-strategy">Startup Strategy</option>
        </select>
      </div>

      {/* SECTION 2: FILE UPLOAD */}
      <div className="mb-6 border-b pb-6">
        <h2 className="font-bold">Upload Paper to {topic}</h2>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-1 ml-2 rounded">
          Upload
        </button>
      </div>

      {/* SECTION 1: CHAT */}
      <div className="border p-4 h-64 overflow-y-auto mb-4 bg-white">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={`inline-block p-2 rounded ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
              {m.content}
            </span>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input 
          className="border p-2 flex-grow" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder={`Ask about ${topic}...`}
        />
        <button onClick={handleChat} className="bg-green-600 text-white px-6 rounded">Send</button>
      </div>
    </div>
  );
}