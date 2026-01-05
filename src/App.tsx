import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import UploadModal from './components/UploadModal';

export default function App() {
  // 1. Initialize State (Empty start, waiting for server)
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Chat State
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/n8n/get-topics')
      .then(res => res.json())
      .then(data => {
        // FIX: Check if data.result exists, otherwise check if data itself is the array
        // This handles both { result: [...] } and raw [...] formats
        const rawList = data.result || data;
        
        const list = Array.isArray(rawList) ? rawList : ["ear-biometrics", "yolo-models", "startup-strategy"];
        setTopics(list);
        
        // Select the first topic automatically
        if (list.length > 0) {
          setCurrentTopic(list[0]);
        }
      })
      .catch(err => {
        console.error("Failed to load topics:", err);
        // Fallback if server fails
        setTopics(["ear-biometrics"]); 
        setCurrentTopic("ear-biometrics");
      });
  }, []);

  // Helper: Save changes to n8n
  const saveTopicsToServer = async (updatedList: string[]) => {
    try {
      await fetch('/api/n8n/save-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: updatedList })
      });
    } catch (err) {
      console.error("Error saving topics:", err);
      alert("Warning: Changes couldn't be saved to the server.");
    }
  };

  // 3. Add Topic Handler (Updates UI + Server)
  const handleAddTopic = () => {
    const newTopic = prompt("Enter new topic name:");
    if (newTopic && !topics.includes(newTopic)) {
      const updatedTopics = [...topics, newTopic];
      setTopics(updatedTopics); // Immediate UI update
      setCurrentTopic(newTopic); // Switch to new topic
      
      saveTopicsToServer(updatedTopics); // Background save
    }
  };

  // 4. Delete Topic Handler (Updates UI + Server)
  const handleDeleteTopic = (topicToDelete: string) => {
    if (confirm(`Delete topic "${topicToDelete}"?`)) {
      const updatedTopics = topics.filter(t => t !== topicToDelete);
      setTopics(updatedTopics);

      // If we deleted the active topic, switch to the first available one
      if (currentTopic === topicToDelete) {
        if (updatedTopics.length > 0) {
          setCurrentTopic(updatedTopics[0]);
        } else {
          setCurrentTopic(""); // No topics left
        }
      }
      
      saveTopicsToServer(updatedTopics);
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
        onDeleteTopic={handleDeleteTopic}
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