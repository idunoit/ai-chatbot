import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function APP() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hello! I am you AI assistant. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  },[messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://ai-chatbot-backend-d4hc.onrender.com/api/chat", {
        method: "POST",
        headers: {"Content-type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: "bot",
        content: data.reply
      }]);

    }
    catch (error) {
      setMessages(prev => [...prev, {
        role: "bot",
        content: "Sorry, something went wrong. Please try again later!"
      }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return(
    <div className="chat-container">
      <div className="chat-header">
          🤖 Ai ChatBot
      </div>

      <div className="chat-messages">
        {messages.map((msg,index) => (
          <div key ={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
  </div>
)}
        <div ref={messagesEndRef}/>
      </div>

      <div className="chat-input">
        <input 
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>

    </div>
  );
}

export default APP;