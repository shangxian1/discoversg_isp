import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CardActionArea
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Receive title and items from the parent (UserHome)
const ContentSection = ({ title, items }) => {

  // Safety check: ensure we have an array to map over
  const safeItems = items || [];

  // Card component for each hidden gem (Dynamic Version)
  const GemCard = ({ title, location, price, category, image, matchScore }) => (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <CardActionArea sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardMedia
          component="img"
          height="240"
          // Use the real image or a placeholder if it's missing or "_"
          image={image && image !== '_' ? image : "https://via.placeholder.com/300"} 
          alt={title}
          sx={{ objectFit: 'cover', width: '100%' }}
        />
        <CardContent sx={{ width: '100%', flexGrow: 1 }}>
          {/* Category Chip */}
          <Chip
            label={category || "Activity"}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 'bold', mb: 1 }}
          />
          
          {/* Title */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {title}
          </Typography>

          {/* Location & Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary' }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2">{location}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'space-between' }}>
             <Typography variant="body2" fontWeight="bold" color="text.primary">
                {price > 0 ? `$${price}` : 'Free'}
             </Typography>
             
             {/* Match Score Badge (Optional) */}
             {matchScore && (
                <Chip 
                  label={`${Math.round(matchScore * 100)}% Match`} 
                  size="small" 
                  sx={{ 
                    bgcolor: matchScore > 0.7 ? '#e8f5e9' : '#fff3e0', 
                    color: matchScore > 0.7 ? '#2e7d32' : '#e65100',
                    fontWeight: 'bold',
                    height: 24
                  }} 
                />
             )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return (
    // Note: We removed 'mt: 8' because UserHome already handles some spacing
    <Box sx={{ mb: 8 }}> 

      {/* --- STATIC CAMPAIGN SECTION (Kept from your design) --- */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>
        Uncover the Unseen
      </Typography>

      <Grid container spacing={3} sx={{ mb: 8 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{
            p: 4, borderRadius: 4, bgcolor: '#e3f2fd', border: '1px solid #bbdefb',
            height: '100%', backgroundImage: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)'
          }}>
            <Typography variant="overline" color="primary" fontWeight="bold">Limited Time</Typography>
            <Typography variant="h5" fontWeight="bold" gutterBottom>SingapoRewards 2026</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Eligible visitors can redeem one free "off-the-beaten-path" experience.
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{
            p: 4, borderRadius: 4, bgcolor: '#f1f8e9', border: '1px solid #dcedc8',
            height: '100%', backgroundImage: 'linear-gradient(135deg, #f1f8e9 0%, #ffffff 100%)'
          }}>
            <Typography variant="overline" color="success.main" fontWeight="bold">New Trail</Typography>
            <Typography variant="h5" fontWeight="bold" gutterBottom>The Last Fishing Village</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Explore Seletar’s rustic past and catch breathtaking sunsets.
            </Typography>
            <Button variant="outlined" color="success" sx={{ borderRadius: 2 }}>View Itinerary</Button>
          </Box>
        </Grid>
      </Grid>

      {/* --- DYNAMIC RECOMMENDATION SECTION --- */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        {title || "Recommended For You"}
      </Typography>

      {safeItems.length === 0 ? (
        <Typography color="text.secondary">No recommendations found yet. Try exploring more!</Typography>
      ) : (
        <Grid container spacing={3}>
          {safeItems.map((item) => (
            // Use 'size' for MUI v6
            <Grid key={item.activityID} size={{ xs: 12, sm: 6, md: 4 }}>
              <GemCard
                title={item.activityName}      // Maps backend 'activityName' -> prop 'title'
                location={item.location}
                price={item.price}
                category={item.categoryName}   // Maps backend 'categoryName' -> prop 'category'
                image={item.activityPicUrl}
                matchScore={item.matchScore}
              />
            </Grid>
          ))}
        </Grid>
      )}

    </Box>
  );
};

export default ContentSection;