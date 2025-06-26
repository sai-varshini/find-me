import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f2f2f2' }}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/chat" style={linkStyle}>Chat</Link>
      <Link to="/contact" style={linkStyle}>Contact</Link>
      <Link to="/gallery">Check out our Gallery</Link>


    </nav>
  );
};

const linkStyle = {
  marginRight: '1rem',
  textDecoration: 'none',
  fontWeight: 'bold',
  color: '#333',
};

export default Navbar;
