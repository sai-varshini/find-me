import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append("username", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);

      await axios.post('https://find-me-t594.onrender.com/register', formData);

      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;

      if (detail === "Username already exists") {
        alert("This username is already taken.");
      } else if (typeof detail === 'string' && detail.includes("UNIQUE constraint failed: users.email")) {
        alert("This email is already registered.");
      } else {
        alert("Registration error. Please try again.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={containerStyle}
    >
      <motion.h2
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        Register
      </motion.h2>

      <motion.input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        style={inputStyle}
        whileFocus={{ scale: 1.03 }}
      />
      <motion.input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={inputStyle}
        whileFocus={{ scale: 1.03 }}
      />
      <motion.input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        style={inputStyle}
        whileFocus={{ scale: 1.03 }}
      />

      <motion.button
        onClick={handleRegister}
        style={buttonStyle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Register
      </motion.button>
    </motion.div>
  );
};

const containerStyle = {
  maxWidth: '400px',
  margin: '2rem auto',
  padding: '2rem',
  textAlign: 'center',
  border: '1px solid #ccc',
  borderRadius: '10px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const inputStyle = {
  margin: '0.5rem 0',
  padding: '0.5rem',
  width: '100%',
  border: '1px solid #ccc',
  borderRadius: '5px'
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  marginTop: '1rem',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default Register;
