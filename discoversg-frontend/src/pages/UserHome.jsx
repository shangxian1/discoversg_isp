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
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const UserHome = () => {
  // 1. Retrieve the user object from localStorage saved during login
  const userData = JSON.parse(localStorage.getItem('user'));

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 5 }}>
      {/* Hero / Carousel Section */}
      <Box sx={{ 
        position: 'relative', 
        height: '400px', 
        bgcolor: '#d9c5c5', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 2
      }}>
        <IconButton sx={{ bgcolor: 'white' }}><ArrowBackIosNewIcon /></IconButton>

        {/* Search & Badge UI */}
        <Box sx={{ 
          position: 'absolute', 
          top: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Paper elevation={3} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, borderRadius: '50px' }}>
            <IconButton sx={{ p: '10px' }}><SearchIcon /></IconButton>
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" />
          </Paper>
          <Chip
            icon={<FavoriteBorderIcon style={{ color: 'white' }} />}
            label="Itinerary (1)"
            sx={{ bgcolor: '#196f75', color: 'white', height: '40px', borderRadius: '20px', px: 1 }}
          />
        </Box>

        <IconButton sx={{ bgcolor: 'white' }}><ArrowForwardIosIcon /></IconButton>
      </Box>

      {/* 2. Welcome Message Section */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box>
            {/* Displaying the dynamic username from the database */}
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#196f75' }}>
              Welcome back, {userData?.name || 'Explorer'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ready to discover more of Singapore today?
            </Typography>
          </Box>
        </Box>

        {/* Content Grids for "For You" and "Featured" */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>For You:</Typography>
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={4} key={item}>
                <Paper elevation={0} sx={{ height: '180px', bgcolor: '#e0e0e0', borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>Featured:</Typography>
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={4} key={item}>
                <Paper elevation={0} sx={{ height: '180px', bgcolor: '#e0e0e0', borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default UserHome;