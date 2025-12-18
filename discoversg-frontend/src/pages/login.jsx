import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    navigate('/planner');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh', 
      bgcolor: '#f5f5f5' 
    }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
        
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Login
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Please sign in to continue
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button 
                type="submit" 
                variant="contained" 
                // removed fullWidth since you have a specific width
                size="large"
                sx={{ width: 120, backgroundColor: '#196f75', borderRadius: 3 }} 
            >
                Login
            </Button>
            </Box>

          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
            Don't have an account? Click{' '}
            <Link to="/SignUp[" style={{ color: '#196f75', fontWeight: 'bold', cursor: 'pointer' }}>
              here
            </Link>
            {' '}to sign up
          </Typography>

        </form>
      </Paper>
    </Box>
  );
};

export default Login;