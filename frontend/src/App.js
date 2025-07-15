import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Chat from './chat';
import Contact from './pages/contact';
import Gallery from './pages/gallery';
import About from './pages/about';
import { initGA, logPageView } from './utils/analytics';

// A wrapper to log page views on route change
const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);

  return null;
};

function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <Router>
      <RouteChangeTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
