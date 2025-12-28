import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, Collapse } from '@mui/material'; // Added Alert and Collapse
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Could not connect to the server. Please try again later.");
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Login
        </Typography>

        {/* Error Message Section */}
        <Collapse in={Boolean(error)}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Collapse>

        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            error={Boolean(error)} 
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={Boolean(error)}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              sx={{ width: 120, backgroundColor: '#196f75', borderRadius: 3, '&:hover': { backgroundColor: '#145a5f' } }}
            >
              Login
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;