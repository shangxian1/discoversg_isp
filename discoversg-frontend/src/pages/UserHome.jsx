import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  InputBase, 
  IconButton, 
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// 1. Import your shared components
import HeroCarousel from '../components/home/HeroCarousel';
import ContentSection from '../components/home/ContentSection';

const UserHome = () => {
  // Retrieve the user object from localStorage
  const userData = JSON.parse(localStorage.getItem('user'));

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 5 }}>
      
      {/* 2. Replaced the manual hero Box with your component */}
      <HeroCarousel />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Search & Badge UI moved below Hero for better visibility in UserHome */}
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 4
        }}>
        </Box>

        {/* Welcome Message Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#196f75' }}>
            Welcome back, {userData?.name || 'Explorer'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ready to discover more of Singapore today?
          </Typography>
        </Box>

        {/* 3. Inserted the ContentSection here */}
        <ContentSection />
      </Container>
    </Box>
  );
};

export default UserHome;