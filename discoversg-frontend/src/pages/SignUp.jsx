import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, Collapse, Link, emphasize } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const hasLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Could not connect to the server.");
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        // py: 10 adds significant vertical spacing (80px)
        py: 10, 
        // Ensures the container takes up the full remaining height of the screen
        minHeight: '90vh', 
        bgcolor: '#f5f5f5' 
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          width: '100%', 
          maxWidth: 450, // Slightly wider for a cleaner look
          borderRadius: 2 
        }}
      >
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Sign Up
        </Typography>

        <Collapse in={Boolean(error)}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        </Collapse>

        <Collapse in={success}>
          <Alert severity="success" sx={{ mb: 2 }}>Account created! Redirecting...</Alert>
        </Collapse>

        <form onSubmit={handleSignup}>
          <TextField
            label="Username *"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Email *"
            type="Email"
            fullWidth
            margin="normal"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password *"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm Password *"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={password !== confirmPassword && confirmPassword !== ''}
            helperText={password !== confirmPassword && confirmPassword !== '' ? "Passwords must match" : ""}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              sx={{ 
                width: '100%', 
                py: 1.5, // Thicker button
                backgroundColor: '#196f75', 
                borderRadius: 2, 
                mb: 3,
                fontSize: '1.1rem',
                '&:hover': { backgroundColor: '#145a5f' } 
              }}
            >
              REGISTER
            </Button>
            
            <Typography variant="body1">
              Already have an account?{' '}
              <Link 
                component="button" 
                type="button"
                variant="body1" 
                onClick={() => navigate('/login')}
                sx={{ color: '#196f75', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
              >
                Login here
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup;