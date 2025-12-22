import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import UploadModal from './components/UploadModal';

export default function App() {
  const [topics, setTopics] = useState(["ear-biometrics", "yolo-models", "startup-strategy"]);
  const [currentTopic, setCurrentTopic] = useState("ear-biometrics");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Chat State
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTopic = () => {
    const newTopic = prompt("Enter new topic name:");
    if (newTopic && !topics.includes(newTopic)) {
      setTopics([...topics, newTopic]);
      setCurrentTopic(newTopic);
    }
  };

  const handleChat = async () => {
    if(!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch('/api/n8n/chat-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chatInput: input,
          topic: currentTopic, 
          sessionId: "user-session-2"
        })
      });

      const data = await response.json();
      const aiText = data.output || "I couldn't find an answer.";
      setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans">
      <Sidebar 
        topics={topics} 
        currentTopic={currentTopic}
        onSelectTopic={setCurrentTopic}
        onAddTopic={handleAddTopic}
        onOpenUpload={() => setIsUploadOpen(true)}
      />
      
      <ChatArea 
        topic={currentTopic}
        messages={messages}
        input={input}
        setInput={setInput}
        onSend={handleChat}
        loading={loading}
      />

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        topic={currentTopic}
      />
    </div>
  );
}