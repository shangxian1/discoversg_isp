import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Button, 
  Chip,
  CardActions,
  Divider
} from '@mui/material';

export default function ActivityCard({ activity, featured, compact }) {
  // 1. Map variables directly from the activity object sent by your backend
  const id = activity?.id;
  const title = activity?.title ?? '';
  const category = activity?.category ?? '';
  const location = activity?.location ?? '';
  const address = activity?.address ?? '';
  
  // Ensure these match the keys in your activity_routes.js 'formatted' object
  const summary = activity?.summary ?? ''; 
  const description = activity?.description ?? ''; 
  
  const price = activity?.price ?? '';
  const image = activity?.image ?? '';

  const navigationState = {
    activityName: title,
    categoryName: category,
    location: location,
    address: address,
    summary: summary,
    description: description,
    price: price,
    finalImage: image
  };

  // 2. Compact Layout (Grid View)
  if (compact) {
    return (
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          borderRadius: 4, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <CardMedia component="img" height="160" image={image} alt={title} sx={{ objectFit: 'cover' }} />
        
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography variant="caption" color="primary" fontWeight="bold" sx={{ textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
            {location}
          </Typography>
          
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 1, lineHeight: 1.3 }}>
            {title}
          </Typography>
          
          {/* FIXED: Explicitly rendering the 'summary' variable here */}
          <Typography variant="body2" color="text.secondary" sx={{ 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            fontSize: '0.85rem',
            mb: 1
          }}>
            {summary} 
          </Typography>
        </CardContent>

        <Divider variant="middle" sx={{ opacity: 0.6 }} />

        <CardActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight="bold" color="teal">
            {parseFloat(price) > 0 ? `$${price}` : 'Free'}
          </Typography>
          <Button
            component={Link}
            to={`/activity/${id}`}
            state={navigationState}
            variant="contained"
            disableElevation
            sx={{ bgcolor: '#0d9488', borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
          >
            View
          </Button>
        </CardActions>
      </Card>
    );
  }

  // 3. Featured Layout (Large Top Card)
  return (
    <Card sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <CardMedia component="img" height="320" image={image} alt={title} sx={{ objectFit: 'cover' }} />
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>{title}</Typography>
            
            {/* FIXED: Added Summary as a sub-header in the Featured view */}
            <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: 500 }}>
              {summary}
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary">
              {location} • {address}
            </Typography>
          </Box>
          <Chip label={category} sx={{ bgcolor: '#ccfbf1', color: '#115e59', fontWeight: 'bold' }} />
        </Box>
        
        {/* Description is kept here for the Featured card only */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, maxWidth: '80%' }}>
          {description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="900" color="#0d9488">
            {parseFloat(price) > 0 ? `$${price}` : 'Free'}
          </Typography>
          <Button
            component={Link}
            to={`/activity/${id}`}
            state={navigationState}
            variant="contained"
            size="large"
            sx={{ bgcolor: '#0d9488', borderRadius: 3, px: 6, py: 1.5, fontWeight: 'bold' }}
          >
            Explore Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}