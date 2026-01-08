import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CardActionArea,
  Container
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const GemCard = ({ item }) => {
  const navigate = useNavigate();

  const imageMap = {
    'national_gallery.jpg': '/assets/national_gallery.jpg',
    'artscience_museum.jpg': '/assets/artscience_museum.jpg',
    'asian_museum.jpg': '/assets/asian_museum.jpg',
    'gbtb.jpg': '/assets/gbtb.jpg',
    'macritchie.jpg': '/assets/macritchie.jpg',
  };

  const finalImage = imageMap[item.activityPicUrl] || '';

  const handleNavigate = () => {
    navigate(`/activity/${item.activityID}`, { 
      state: { ...item, finalImage } 
    });
  };

  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%', // Card must take 100% of Grid item width
        height: '100%', 
        borderRadius: 3, 
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <CardActionArea 
        onClick={handleNavigate} 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch' 
        }}
      >
        <Box sx={{ width: '100%', position: 'relative' }}>
          <CardMedia
            component="img"
            image={finalImage}
            alt={item.activityName}
            sx={{ 
              // FORCE SETTINGS
              width: '100% !important', // Force width to match the box
              height: '200px',           // Hard-coded height for perfect alignment
              objectFit: 'cover',        // Crop instead of stretch
              display: 'block',
              margin: '0 auto'
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Chip 
            label={item.categoryName || "Activity"} 
            size="small" 
            variant="outlined"
            sx={{ mb: 1, fontWeight: 'bold' }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              fontSize: '1.1rem',
              lineHeight: 1.2,
              mb: 1
            }}
          >
            {item.activityName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mt: 'auto' }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: '#d31111' }} />
            <Typography variant="body2" noWrap sx={{ maxWidth: '100%' }}>
              {item.location}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const ContentSection = ({ title, items }) => {
  const safeItems = items || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        {title || "Recommended For You"}
      </Typography>

      <Grid container spacing={3}>
        {safeItems.map((item) => (
          <Grid 
            key={item.activityID} 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            sx={{ 
              display: 'flex', // Ensures the card fills the grid item height
              justifyContent: 'center' 
            }}
          >
            <GemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ContentSection;