import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Container, Paper, CardContent, IconButton, CircularProgress } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const ItineraryPage = () => {
  const [itinerary, setItinerary] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace '1' with the dynamic ID if you implement routing later (e.g., useParams)
    fetch('http://localhost:3000/api/itinerary/1')
      .then((res) => res.json())
      .then((data) => {
        setItinerary(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching itinerary:", err);
        setLoading(false);
      });
  }, []);

  // Show loading spinner while fetching
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#c61a1a' }} />
      </Box>
    );
  }

  if (!itinerary) return <Typography align="center" sx={{ mt: 10 }}>Itinerary not found.</Typography>;

  // Filter the joined items by the day currently selected in the Tabs
  const dayItems = itinerary.items.filter(item => item.dayNumber === selectedDay);

  // Helper to format SQL Time (14:00:00) to display time (14:00)
  const formatTime = (timeString) => {
    if (!timeString) return "TBD";
    return timeString.substring(0, 5); 
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', pb: 10, position: 'relative' }}>
      {/* Decorative Striped Background */}
      <Box sx={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, opacity: 0.05,
        backgroundImage: 'linear-gradient(90deg, #c61a1a 40px, transparent 40px)',
        backgroundSize: '80px 100%' 
      }} />

      <Container maxWidth="md" sx={{ pt: 8 }}>
        <Typography variant="h2" align="center" sx={{ fontWeight: 800, mb: 1, textTransform: 'uppercase' }}>
          {itinerary.title}
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" sx={{ mb: 4 }}>
          {itinerary.budgetLevel} Budget • {itinerary.noOfDays} Days in Singapore
        </Typography>

        {/* Dynamic Day Tabs based on noOfDays from DB */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Tabs 
            value={selectedDay} 
            onChange={(e, val) => setSelectedDay(val)}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{ 
              '& .MuiTab-root': { bgcolor: '#d9d9d9', borderRadius: '50px', mx: 1, fontWeight: 'bold', minWidth: 100 },
              '& .Mui-selected': { bgcolor: '#bdbdbd !important', color: '#000 !important' } 
            }}
          >
            {[...Array(itinerary.noOfDays)].map((_, i) => (
              <Tab key={i + 1} value={i + 1} label={`Day ${i + 1}`} />
            ))}
          </Tabs>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Day {selectedDay} Schedule
        </Typography>

        <Grid container spacing={3}>
          {dayItems.length > 0 ? dayItems.map((item, index) => (
            <Grid item xs={12} key={item.itineraryItemID || index}>
              <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', bgcolor: '#d9d9d9', borderRadius: '25px', p: 2 }}>
                
                {/* Activity Image with Fallback */}
                <Box sx={{ 
                  width: 160, height: 120, bgcolor: '#000', borderRadius: '20px', flexShrink: 0,
                  backgroundImage: item.activityPicUrl && item.activityPicUrl !== '_' 
                    ? `url(/assets/${item.activityPicUrl})` 
                    : `url('https://via.placeholder.com/160x120?text=No+Image')`, 
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />

                <CardContent sx={{ flexGrow: 1, ml: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{item.activityName}</Typography>
                  <Box sx={{ display: 'flex', gap: 4, mt: 1 }}>
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontWeight: 'bold' }}>Location</Typography>
                      <Typography variant="body1">{item.location}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontWeight: 'bold' }}>Start Time</Typography>
                      <Typography variant="body1">{formatTime(item.startTime)}</Typography>
                    </Box>
                  </Box>
                  {item.notes && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'gray' }}>
                      Note: {item.notes}
                    </Typography>
                  )}
                </CardContent>

                <Box sx={{ textAlign: 'center', pr: 2 }}>
                  <IconButton sx={{ color: '#c61a1a' }}>
                    <CancelIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Remove</Typography>
                </Box>
              </Paper>
            </Grid>
          )) : (
            <Grid item xs={12}>
              <Typography align="center" color="textSecondary">No activities planned for this day.</Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ItineraryPage;