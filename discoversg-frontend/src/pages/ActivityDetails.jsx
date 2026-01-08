import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ActivityDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // If no state is passed (e.g., manual URL refresh), show a fallback
  if (!state) return (
    <Box sx={{ p: 10, textAlign: 'center' }}>
      <Typography variant="h5">Activity not found.</Typography>
      <Button onClick={() => navigate('/')}>Return Home</Button>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', pb: 10 }}>
      {/* NOTE: We are NOT importing NavBar/Footer here because 
         they are already provided by MainLayout in App.js 
      */}

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Back Button */}
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ mb: 2, color: 'text.primary' }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 8, 
            overflow: 'hidden', 
            bgcolor: '#e0d1d1', // Matches the light brownish wireframe background
            pb: 6 
          }}
        >
          {/* 1. Large Image Section */}
          <Box
            component="img"
            src={state.finalImage}
            alt={state.activityName}
            sx={{
              width: '100%',
              height: { xs: 250, md: 450 }, // Responsive height
              objectFit: 'cover',
              display: 'block',
              bgcolor: 'black'
            }}
          />

          {/* 2. Details Content */}
          <Box sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2, color: '#1a1a1a' }}>
              {state.activityName}
            </Typography>

            {/* Category and Price Grid */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8, mb: 4 }}>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>Category</Typography>
                <Typography variant="h6">{state.categoryName || 'General'}</Typography>
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>Price</Typography>
                <Typography variant="h6">{state.price > 0 ? `$${state.price}` : 'Free'}</Typography>
              </Box>
            </Box>

            {/* Description */}
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 5, 
                px: { md: 8 }, 
                color: 'text.secondary', 
                lineHeight: 1.7 
              }}
            >
              {state.description || "Experience the best of Singapore with this curated activity. Explore unique sights and sounds at this premier destination."}
            </Typography>

            {/* Location Info */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold">
                {state.locationName || state.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {state.location}
              </Typography>
            </Box>

            {/* Opening Hours */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                Opening Hours
              </Typography>
              <Typography variant="body2">
                {state.openingHours || "Daily: 09:00 AM - 09:00 PM"}
              </Typography>
            </Box>

            {/* 3. Add Button (Wireframe Teal) */}
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: '#1a8a8a', 
                '&:hover': { bgcolor: '#146e6e' },
                px: 8,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 14px rgba(26, 138, 138, 0.4)'
              }}
            >
              Add to Itinerary
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ActivityDetails;