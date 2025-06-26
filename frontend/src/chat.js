// src/pages/Chat.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function ChatbotPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! What can I do for you today?" },
  ]);
  const [input, setInput] = useState("");
  const [coords, setCoords] = useState(null);
  const [listening, setListening] = useState(false);
  const [history, setHistory] = useState([]);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error("Geolocation Error:", err.message);
        addMessage("bot", "Location access denied or failed.");
      }
    );
  }, []);

  const addMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript;
      setInput(voiceInput);
      setListening(false);
      handleUserInput(voiceInput);
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const handleUserInput = async (voiceInput) => {
    const userInput = voiceInput ?? input;
    if (!userInput.trim()) return;
    addMessage("user", userInput);

    if (!coords) {
      addMessage("bot", "Waiting for location...");
      return;
    }

    const lower = userInput.toLowerCase();
    let origin = null, destination = null;

    if (lower.includes("distance between")) {
      const match = userInput.match(/distance between (.+) and (.+)/i);
      if (match && match.length === 3) {
        origin = match[1].trim();
        destination = match[2].trim();
      }
    } else if (lower.includes("how far") || lower.includes("distance to") || lower.includes("how long to")) {
      const match =
        userInput.match(/how far (?:is )?(.*?)(?: from me|\?|$)/i) ||
        userInput.match(/distance to (.*?)(?:\?|$)/i) ||
        userInput.match(/how long to (.*?)(?:\?|$)/i);
      if (match && match.length >= 2) {
        origin = `${coords.lat},${coords.lng}`;
        destination = match[1].trim();
      }
    }

    if (origin && destination) {
      try {
        const res = await axios.get("http://localhost:8000/distance", {
          params: { origin, destination },
        });
        addMessage("bot", `Distance: ${res.data.distance}, Duration: ${res.data.duration}`);
      } catch (err) {
        console.error(err);
        addMessage("bot", "Failed to fetch distance. Try again later.");
      }

      await saveSearch(userInput); // ✅ Save query
      setInput("");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/places", {
        params: { lat: coords.lat, lng: coords.lng, query: userInput },
      });

      await saveSearch(userInput); // ✅ Save query

      if (res.data.results && res.data.results.length > 0) {
        const items = res.data.results.map((place) =>
          `\n• ${place.name} (${place.vicinity})\n⭐ ${place.rating ?? "No rating"} - ` +
          `[View on map](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)})`
        );
        addMessage("bot", `Here are some ${userInput}s near you:` + items.join("\n"));
      } else {
        addMessage("bot", "No places found for this query.");
      }
    } catch (err) {
      console.error(err);
      addMessage("bot", "Error fetching places. Check backend/API key.");
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUserInput();
    }
  };

  const saveSearch = async (query) => {
    const username = localStorage.getItem("user");
    if (!username) return;
    try {
      await axios.post("http://localhost:8000/search-history", {
        username,
        query,
      });
    } catch (err) {
      console.error("Failed to save search", err);
    }
  };

  const fetchHistory = async () => {
    const username = localStorage.getItem("user");
    if (!username) return;
    try {
      const res = await axios.get(`http://localhost:8000/search-history/${username}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem", fontFamily: "Arial" }}>
      <h2>Chatbot Assistant</h2>
      <div style={{ height: "400px", overflowY: "scroll", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", background: "#f9f9f9" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === "bot" ? "left" : "right", marginBottom: "1rem" }}>
            <div style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              background: msg.from === "bot" ? "#e0e0e0" : "#007bff",
              color: msg.from === "bot" ? "black" : "white",
              whiteSpace: "pre-wrap"
            }}
              dangerouslySetInnerHTML={{
                __html: msg.text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),
              }}>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1rem", display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me something..."
          style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button onClick={() => handleUserInput()} style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}>Send</button>
        <button onClick={handleVoiceInput} style={{ marginLeft: "0.5rem", padding: "0.5rem" }}>
          {listening ? "🎙️..." : "🎙️"}
        </button>
      </div>

      <button onClick={fetchHistory} style={{ marginTop: "1rem" }}>📜 View Search History</button>
      <ul style={{ marginTop: "0.5rem", textAlign: "left" }}>
        {history.map((item, index) => (
          <li key={index}>{item.query} <span style={{ fontSize: "0.8rem", color: "#888" }}>({new Date(item.timestamp).toLocaleString()})</span></li>
        ))}
      </ul>
    </div>
  );
}

export default ChatbotPage;
