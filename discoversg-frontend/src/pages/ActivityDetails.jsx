import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Box, Typography, Button, Container, Paper, IconButton 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ActivityDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(state);
  const [loading, setLoading] = useState(!state);

  useEffect(() => {
    // Fallback if state is lost (e.g., page refresh)
    if (!activity) {
      fetch(`http://localhost:3000/api/activity/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setActivity({
            activityName: data.activityName,
            categoryName: data.categoryName,
            location: data.location,
            address: data.address, 
            summary: data.summary,
            description: data.description,
            price: data.price,
            finalImage: `/assets/${data.activityPicUrl}`
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, activity]);

  if (loading) return <Typography sx={{ p: 10, textAlign: 'center' }}>Loading...</Typography>;
  if (!activity) return <Typography sx={{ p: 10, textAlign: 'center' }}>Activity not found.</Typography>;

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <Paper elevation={0} sx={{ borderRadius: 8, overflow: 'hidden', bgcolor: '#e0d1d1', pb: 6 }}>
          <Box component="img" src={activity.finalImage} sx={{ width: '100%', height: 450, objectFit: 'cover' }} />

          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>{activity.activityName}</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8, mb: 4 }}>
              <Box>
                <Typography variant="overline" color="text.secondary">Category</Typography>
                <Typography variant="h6">{activity.categoryName}</Typography>
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">Price</Typography>
                <Typography variant="h6">{activity.price > 0 ? `$${activity.price}` : 'Free'}</Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ mb: 5, px: 8, color: 'text.secondary', lineHeight: 1.7 }}>
              {activity.description}
            </Typography>

            {/* LOCATION INFO SECTION */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold">
                {activity.location} {/* e.g., "City Hall" */}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activity.address} {/* e.g., "1 St Andrew’s Rd, Singapore 178957" */}
              </Typography>
            </Box>

            <Button variant="contained" size="large" sx={{ bgcolor: '#1a8a8a', px: 8 }}>
              Add to Itinerary
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ActivityDetails;