import React, { useState, useEffect } from 'react';
import { Box, Container, IconButton, InputBase, Paper, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Import images with updated paths
import banner1 from '/assets/banner1.png'; 
import banner2 from '/assets/banner2.png';
import banner3 from '/assets/banner3.png';

const bannerImages = [
  { id: 1, src: banner1, alt: "Singapore Banner 1" },
  { id: 2, src: banner2, alt: "Singapore Banner 2" },
  { id: 3, src: banner3, alt: "Singapore Banner 3" }
];

const HeroCarousel = ({searchQuery, setSearchQuery}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', paddingBottom: '30px' }}>
      {/* Image Container */}
      <Box sx={{ position: 'relative', height: { xs: '300px', md: '500px' }, width: '100%', overflow: 'hidden' }}>
        {bannerImages.map((item, index) => (
          <Box
            key={item.id}
            component="img"
            src={item.src}
            alt={item.alt}
            sx={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: index === activeStep ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: index === activeStep ? 1 : 0,
            }}
          />
        ))}
      </Box>

      {/* Search Bar Overlay */}
      <Container maxWidth="md" sx={{ position: 'relative', mt: -4, zIndex: 10 }}>
        <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 5, boxShadow: 3 }}>
          <IconButton sx={{ p: '10px' }}><SearchIcon /></IconButton>
          <InputBase type='search'
          sx={{ ml: 1, flex: 1 }} placeholder="Search for locations, food, or activities..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Button variant="contained" color="secondary" sx={{ borderRadius: 5, px: 4 }}>Search</Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default HeroCarousel;