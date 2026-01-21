import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Button, Container, Paper, IconButton, TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BACKEND_URL } from '../constants';

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [selectedDate, setSelectedDate] = useState('');
  const [pax, setPax] = useState(1);

  // --- Helper: Resolve Image URL ---
  const getImageUrl = (filename) => {
    if (!filename || filename === '_') return 'https://via.placeholder.com/600x400?text=No+Image';
    // If it's already a full link (e.g. from Unsplash), use it
    if (filename.startsWith('http')) return filename;
    // Otherwise, assume it's in the FRONTEND public/assets folder
    return `/assets/${filename}`;
  };

  useEffect(() => {
    // 1. Instant Load: If we came from the list page, use that data first
    if (location.state && location.state.image) {
      setActivity({
        ...location.state,
        finalImage: getImageUrl(location.state.image || location.state.activityPicUrl)
      });
      setLoading(false);
    }

    // 2. Fetch Fresh Data (in case of direct link or refresh)
    // Make sure your backend route matches this (plural /activities/)
    fetch(`${BACKEND_URL}/api/activity/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Activity not found");
        return res.json();
      })
      .then((data) => {
        // Handle database field names
        setActivity({
          activityName: data.activityName || data.title,
          categoryName: data.categoryName || data.category || "Activity",
          location: data.location,
          address: data.address,
          summary: data.summary,
          description: data.description,
          price: Number(data.price),
          // Use the helper to determine the correct path
          finalImage: getImageUrl(data.activityPicUrl || data.image)
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching activity:", err);
        setLoading(false);
      });
  }, [id, location.state]);

  const handleBook = () => {
    if (!selectedDate) return alert("Please select a date.");
    if (pax < 1) return alert("Please enter at least 1 person.");

    navigate('/payment', {
      state: {
        activityId: id,
        activityName: activity.activityName,
        price: activity.price,
        date: selectedDate,
        pax: parseInt(pax),
        noOfPax: parseInt(pax),
        totalPrice: activity.price * pax
      },
    });
  };

  if (loading) return <Typography sx={{ p: 10, textAlign: 'center' }}>Loading...</Typography>;
  if (!activity) return <Typography sx={{ p: 10, textAlign: 'center' }}>Activity not found.</Typography>;

  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <Paper elevation={0} sx={{ borderRadius: 8, overflow: 'hidden', bgcolor: '#e0d1d1', pb: 6 }}>

          {/* IMAGE SECTION */}
          <Box
            component="img"
            src={activity.finalImage}
            alt={activity.activityName}
            // Fallback if the specific file is missing
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Image+Missing'; }}
            sx={{ width: '100%', height: 450, objectFit: 'cover' }}
          />

          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>{activity.activityName}</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 8, mb: 4 }}>
              <Box>
                <Typography variant="overline" color="text.secondary">Category</Typography>
                <Typography variant="h6">{activity.categoryName}</Typography>
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">Price / Pax</Typography>
                <Typography variant="h6">{activity.price > 0 ? `$${activity.price.toFixed(2)}` : 'Free'}</Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ mb: 5, px: { xs: 2, md: 8 }, color: 'text.secondary', lineHeight: 1.7 }}>
              {activity.description || activity.summary}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold">{activity.location}</Typography>
              <Typography variant="body2" color="text.secondary">{activity.address}</Typography>
            </Box>

            {/* DATE & PAX INPUTS */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, maxWidth: '400px', mx: 'auto' }}>
              <TextField
                label="Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                fullWidth
                sx={{ bgcolor: 'white' }}
              />
              <TextField
                label="Pax"
                type="number"
                value={pax}
                onChange={(e) => setPax(e.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
                sx={{ bgcolor: 'white' }}
              />
            </Box>

            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#1a8a8a' }}>
              Total: ${(activity.price * pax).toFixed(2)}
            </Typography>

            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: '#1a8a8a', px: 8 }}
              onClick={handleBook}
            >
              Book Activity
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ActivityDetails;