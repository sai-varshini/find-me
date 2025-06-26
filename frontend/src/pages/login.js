import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Fade
} from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      await axios.post('https://find-me-t594.onrender.com/login', formData);
      localStorage.setItem('user', username);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <Fade in timeout={800}>
      <Paper elevation={6} sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </Box>
        <Box mt={2} textAlign="center">
          <Button onClick={() => navigate('/register')}>Register</Button>
        </Box>
      </Paper>
    </Fade>
  );
};

export default Login;
