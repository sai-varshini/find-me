// src/pages/About.js
import React from 'react';
import './about.css'; // For styling & animation

const About = () => {
  return (
    <div className="about-container">
      <h1 className="fade-in">About FindMe</h1>
      <p className="slide-in">
        <strong>FindMe</strong> is a smart assistant that helps you locate nearby places, 
        get travel information, and interact through voice or text. It's designed for ease, speed, and accuracy.
      </p>

      <div className="about-section zoom-in">
        <h3>✨ Features</h3>
        <ul>
          <li>Find nearby restaurants, ATMs, hospitals, and more</li>
          <li>Voice and text input support</li>
          <li>Live location-based search</li>
          <li>Integrated Google Maps and Gallery</li>
        </ul>
      </div>

      <div className="about-section slide-up">
        <h3>🚀 Tech Stack</h3>
        <p>
          <strong>Frontend:</strong> React, CSS3<br />
          <strong>Backend:</strong> FastAPI, SQLite<br />
          <strong>APIs:</strong> Google Maps, Places, Directions<br />
        </p>
      </div>
    </div>
  );
};

export default About;
