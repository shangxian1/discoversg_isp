import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Container, Paper, CardContent, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const ItineraryPage = () => {
  const [itinerary, setItinerary] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1); // Default to Day 1

  useEffect(() => {
    // Replace '1' with the actual itinerary ID you want to load
    fetch('http://localhost:3000/api/itinerary/1')
      .then(res => res.json())
      .then(data => setItinerary(data))
      .catch(err => console.error("Error fetching itinerary:", err));
  }, []);

  if (!itinerary) return <Typography>Loading your SG adventure...</Typography>;

  // Filter items based on the selected tab (Day 1, Day 2, etc.)
  const dayItems = itinerary.items.filter(item => item.dayNumber === selectedDay);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', pb: 10 }}>
      {/* Decorative Striped Background to match your screenshot */}
      <Box sx={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, opacity: 0.05,
        backgroundImage: 'linear-gradient(90deg, #c61a1a 40px, transparent 40px)',
        backgroundSize: '80px 100%' 
      }} />

      <Container maxWidth="md" sx={{ pt: 8 }}>
        <Typography variant="h2" align="center" sx={{ fontWeight: 800, mb: 4 }}>
          Your Singapore Itinerary
        </Typography>

        {/* Dynamic Day Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Tabs 
            value={selectedDay} 
            onChange={(e, val) => setSelectedDay(val)}
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{ '& .MuiTab-root': { bgcolor: '#d9d9d9', borderRadius: '50px', mx: 1, fontWeight: 'bold' },
                  '& .Mui-selected': { bgcolor: '#bdbdbd !important', color: '#000 !important' } }}
          >
            {[...Array(itinerary.noOfDays)].map((_, i) => (
              <Tab key={i + 1} value={i + 1} label={`Day ${i + 1}`} />
            ))}
          </Tabs>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Day {selectedDay}: Hidden Gems
        </Typography>

        <Grid container spacing={3}>
          {dayItems.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#d9d9d9', borderRadius: '25px', p: 2 }}>
                {/* Activity Image from Database */}
                <Box sx={{ 
                  width: 160, height: 120, bgcolor: '#000', borderRadius: '20px', flexShrink: 0,
                  backgroundImage: `url(/assets/${item.activityPicUrl})`, backgroundSize: 'cover'
                }} />

                <CardContent sx={{ flexGrow: 1, ml: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{item.activityName}</Typography>
                  <Box sx={{ display: 'flex', gap: 6, mt: 1 }}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Location</Typography>
                      <Typography variant="body1">{item.location}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Time</Typography>
                      <Typography variant="body1">{item.startTime}</Typography>
                    </Box>
                  </Box>
                </CardContent>

                <Box sx={{ textAlign: 'center', pr: 2 }}>
                  <IconButton sx={{ color: '#c61a1a' }}><CancelIcon sx={{ fontSize: 40 }} /></IconButton>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Details</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ItineraryPage;