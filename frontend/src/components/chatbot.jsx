import React, { useState, useEffect } from 'react';
import './ChatBot.css';
import { logChatEvent } from './utils/analytics';

function ChatBot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! How can I help you find a place?' }
  ]);
  const [input, setInput] = useState('');

  // Log 'Chat Started' once when the component mounts
  useEffect(() => {
    logChatEvent('Chat Started', 'Bot greeted user');
  }, []);

  const handleSend = () => {
    if (input.trim() === '') return;

    // Log user message
    logChatEvent('User Message Sent', input);
    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    // Clear input
    setInput('');

    // Simulate bot response after delay
    setTimeout(() => {
      const botResponse = { from: 'bot', text: 'Searching for: ' + input };

      // Log bot reply
      logChatEvent('Bot Responded', botResponse.text);

      setMessages(prev => [...prev, botResponse]);
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
