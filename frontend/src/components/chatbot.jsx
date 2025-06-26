import React, { useState } from 'react';
import './ChatBot.css';


function ChatBot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! How can I help you find a place?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');

    // Placeholder response
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: 'Searching for: ' + input }]);
    }, 500);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-row">
        <input
          type="text"
          placeholder="Type your request..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBot;
