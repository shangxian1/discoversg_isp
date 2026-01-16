import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Grid, Container, Paper, CircularProgress, 
  Divider, Chip, Stack, Button, IconButton, Tabs, Tab, List, ListItemButton, ListItemText
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaidIcon from '@mui/icons-material/Paid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SnackBarDialog from '../components/layout/SnackBar';

const ItineraryPage = () => {
  const [itineraries, setItineraries] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0); // Index of the currently selected trip
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const snackRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const userID = userData?.userID || userData?.id || 1; 

    // Fetch all itineraries for this user
    fetch(`http://localhost:3000/api/user-itineraries/${userID}`)
      .then((res) => res.json())
      .then((data) => {
        const parsedItineraries = data.map(item => ({
          ...item,
          // Convert JSON string back to object
          details: item.itineraryInfo ? JSON.parse(item.itineraryInfo) : []
        }));
        setItineraries(parsedItineraries);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching itineraries:", err);
        setLoading(false);
      });
  }, []);

  // Reset selected day to 1 when switching between different itineraries
  useEffect(() => {
    setSelectedDay(1);
  }, [activeIdx]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently remove this itinerary?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/itinerary/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItineraries(prev => prev.filter(itin => itin.itineraryID !== id));
        setActiveIdx(0); // Reset to first item
        if (snackRef.current) snackRef.current.handleState('Itinerary removed.');
      }
    } catch (err) {
      if (snackRef.current) snackRef.current.handleState('Error deleting itinerary.');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}><CircularProgress color="error" /></Box>;
  if (itineraries.length === 0) return <Container sx={{ py: 10, textAlign: 'center' }}><Typography variant="h5">No saved itineraries found. Plan one now!</Typography></Container>;

  const currentItin = itineraries[activeIdx];
  const currentDayData = currentItin?.details.find(d => d.day === selectedDay);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fdfdfd', pb: 10 }}>
      <Container maxWidth="xl" sx={{ pt: 6 }}>
        <Grid container spacing={4}>
          
          {/* --- LEFT SIDEBAR: LIST OF SAVED TRIPS --- */}
          <Grid item xs={12} md={3}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>My Saved Trips</Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>You have {itineraries.length} saved trips</Typography>
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <List sx={{ p: 0 }}>
                {itineraries.map((itin, index) => (
                  <React.Fragment key={itin.itineraryID}>
                    <ListItemButton 
                      selected={activeIdx === index}
                      onClick={() => setActiveIdx(index)}
                      sx={{ 
                        py: 2,
                        '&.Mui-selected': { borderLeft: '5px solid #d32f2f', bgcolor: '#fff4f4' }
                      }}
                    >
                      <ListItemText 
                        primary={itin.title} 
                        secondary={`${itin.noOfDays} Days • ${itin.budgetLevel}`} 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItemButton>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* --- RIGHT CONTENT: SELECTED ITINERARY DETAILS --- */}
          <Grid item xs={12} md={9}>
            {/* Header */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: '#fff', border: '1px solid #eee', mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1 }}>
                    {currentItin.title}
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <Chip icon={<CalendarMonthIcon />} label={`${currentItin.noOfDays} Days`} />
                    <Chip icon={<PaidIcon />} label={currentItin.budgetLevel} color="success" variant="outlined" />
                  </Stack>
                </Box>
                <Button 
                  color="error" 
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => handleDelete(currentItin.itineraryID)}
                >
                  Remove
                </Button>
              </Box>
            </Paper>

            {/* Day Selector */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <Tabs 
                value={selectedDay} 
                onChange={(e, val) => setSelectedDay(val)}
                variant="scrollable"
                sx={{ '& .MuiTabs-indicator': { bgcolor: '#d32f2f' } }}
              >
                {currentItin.details.map((day) => (
                  <Tab key={day.day} value={day.day} label={`Day ${day.day}`} sx={{ fontWeight: 'bold' }} />
                ))}
              </Tabs>
            </Box>

            <Grid container spacing={4}>
              {/* Timeline */}
              <Grid item xs={12} lg={7}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Planned Schedule</Typography>
                {currentDayData?.itinerary.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#d32f2f' }} />
                      {index !== currentDayData.itinerary.length - 1 && <Box sx={{ width: 2, flexGrow: 1, bgcolor: '#eee', my: 1 }} />}
                    </Box>
                    <Paper elevation={0} sx={{ p: 2, mb: 3, flexGrow: 1, border: '1px solid #f0f0f0', borderRadius: 3 }}>
                      <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>{item.time}</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.place_name}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                    </Paper>
                  </Box>
                ))}
              </Grid>

              {/* Sidebar actions */}
              <Grid item xs={12} lg={5}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Location Overview</Typography>
                  {currentDayData?.itinerary.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: '#d32f2f' }} />
                      <Typography variant="body2">{item.place_name}</Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <SnackBarDialog ref={snackRef} />
    </Box>
  );
};

export default ItineraryPage;