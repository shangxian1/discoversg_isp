import React, { useState, useEffect } from 'react'; // <--- 1. Import Hooks
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress
} from '@mui/material';

// Import your shared components
import HeroCarousel from '../components/home/HeroCarousel';
import ContentSection from '../components/home/ContentSection';
import { BACKEND_URL } from '../constants';

const UserHome = () => {
  // Retrieve the user object from sessionStorage
  const userData = JSON.parse(sessionStorage.getItem('user'));

  // --- 2. RESTORE THE STATE & LOGIC ---
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userData || !userData.id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch from your working backend
        const response = await fetch(`${BACKEND_URL}/api/recommendations/${userData.id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userData?.id]);
  // ------------------------------------

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 5 }}>
      
      {/* 2. Replaced the manual hero Box with your component */}
      <HeroCarousel />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        
        {/* Welcome Message Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#196f75' }}>
            Welcome back, {userData?.name || 'Explorer'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ready to discover more of Singapore today?
          </Typography>
        </Box>

        {loading ? (
           <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
        ) : (
           <ContentSection 
              title="For You (Top Matches)" 
              items={recommendations} 
           />
        )}

      </Container>
    </Box>
  );
};

export default UserHome;