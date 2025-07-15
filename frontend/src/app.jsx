import React, { useEffect } from 'react';
import ChatBot from './components/chatbot';
import './App.css';
import { initGA, logPageView } from './utils/analytics';

function App() {
  useEffect(() => {
    initGA();                     // Initialize Google Analytics
    logPageView('/');             // Log homepage view
  }, []);

  return (
    <div className="App">
      <h1>Find Me Chatbot</h1>
      <ChatBot />
    </div>
  );
}

export default App;
