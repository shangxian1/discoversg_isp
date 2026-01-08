import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CardActionArea,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// 1. Manually import your test images
import nationalGalleryImg from '../../assets/national_gallery.jpg';
import artScienceMuseumImg from '../../assets/artscience_museum.jpg';
import asianMuseumImg from '../../assets/asian_museum.jpg';
import gbtbImg from '../../assets/gbtb.jpg';
import macritchieImg from '../../assets/macritchie.jpg';

const GemCard = ({ title, location, price, category, image, matchScore }) => {

  // 2. Create a mapping object
  // This connects the string from your database to the imported file
  const imageMap = {
    'national_gallery.jpg': nationalGalleryImg,
    'artscience_museum.jpg': artScienceMuseumImg,
    'asian_museum.jpg': asianMuseumImg,
    'gbtb.jpg':gbtbImg,
    'macritchie.jpg': macritchieImg,
  };

  // 3. Select the image or a local fallback (avoiding the broken placeholder URL)
  const finalImage = imageMap[image] || '';

  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <CardActionArea sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardMedia
          component="img"
          height="240"
          image={finalImage}
          alt={title}
          sx={{
            height: 240,           // Forces a consistent height
            width: '100%',         // Fills the card width
            objectFit: 'cover',    // Crops the image to fit without distortion
            objectPosition: 'center', // Keeps the center of the image visible
            bgcolor: '#f5f5f5'// Shows a grey box if the image is missing
          }}
        />
        <CardContent sx={{ width: '100%', flexGrow: 1 }}>
          <Chip
            label={category || "Activity"}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 'bold', mb: 1 }}
          />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary' }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2">{location}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" fontWeight="bold" color="text.primary">
              {price > 0 ? `$${price}` : 'Free'}
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
    <Box sx={{ mb: 8 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {title || "Recommended For You"}
      </Typography>

      <Grid container spacing={3}>
        {safeItems.length === 0 ? (
          <Typography sx={{ ml: 3 }} color="text.secondary">No activities found.</Typography>
        ) : (
          safeItems.map((item) => (
            <Grid key={item.activityID} item xs={12} sm={6} md={4}>
              <GemCard
                title={item.activityName}
                location={item.location}
                price={item.price}
                category={item.categoryName}
                image={item.activityPicUrl}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ContentSection;