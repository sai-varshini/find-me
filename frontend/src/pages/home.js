// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // 👈 import the CSS file

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setUsername(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUsername(null);
    navigate('/'); // stay on home
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Top-right Auth Area */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', textAlign: 'right' }}>
        {username ? (
          <>
            <div style={{ fontWeight: 'bold' }}>{username}</div>
            <button onClick={handleLogout} style={logoutStyle}>Logout</button>
          </>
        ) : (
          <button onClick={handleLoginRedirect} style={loginStyle}>Login</button>
        )}
      </div>

      <h1>Welcome to FindMe</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
        This smart assistant helps you find nearby places, check distances, and get info with just your voice or text.
      </p>

      <div style={{ marginTop: '2rem' }}>
        <Link to="/chat" style={linkStyle}>Start Chat</Link>
        <Link to="/contact" style={{ ...linkStyle, marginLeft: '1rem' }}>Contact Us</Link>
        <Link to="/gallery" style={{ ...linkStyle, marginLeft: '1rem' }}>View Gallery</Link>
         <Link to="/about" style={{ ...linkStyle, marginLeft: '1rem' }}>About</Link>
      </div>

     

      <div style={{ marginTop: '3rem' }}>
        <h3>Gallery Preview</h3>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          <img src="https://placekitten.com/200/150" alt="Gallery 1" style={imgStyle} />
          <img src="https://placekitten.com/201/150" alt="Gallery 2" style={imgStyle} />
          <img src="https://placekitten.com/202/150" alt="Gallery 3" style={imgStyle} />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Link to="/gallery" style={linkStyle}>Explore Full Gallery</Link>
        </div>
      </div>
    </div>
  );
};

const linkStyle = {
  padding: '0.8rem 1.2rem',
  backgroundColor: '#5D5B7B',
  color: 'white',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 'bold'
};

const logoutStyle = {
  marginTop: '0.5rem',
  backgroundColor: '#A1CAD8',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '0.3rem 0.8rem',
  cursor: 'pointer'
};

const loginStyle = {
  backgroundColor: '#5D5B7B',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '0.5rem 1rem',
  cursor: 'pointer'
};

const imgStyle = {
  width: '200px',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

export default Home;
