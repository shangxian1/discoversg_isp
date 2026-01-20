import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Autocomplete,
  Checkbox,
  FormControlLabel
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';

// Google Maps Components
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import SnackBarDialog from '../components/layout/SnackBar';

// --- Constants & Styles ---
const BACKGROUND_STRIPE_COLOR = 'rgba(255, 255, 255, 0.7)';
const LIGHT_RED = '#fce4e4';
const PRIMARY_RED = '#d32f2f';
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const backgroundStyles = {
  backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, ${BACKGROUND_STRIPE_COLOR} 10px, ${BACKGROUND_STRIPE_COLOR} 20px)`,
  backgroundSize: '40px 100%',
  minHeight: '100vh',
  flexGrow: 1,
  padding: '40px 0',
};

// --- Sub-component: Itinerary Display ---
const ItineraryDisplay = ({ response, mapMarkers, mapCenter, onSave, isSaving }) => (
  <Box sx={{ width: '100%' }}>
    {/* Header with Save Option */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant='h4' sx={{ fontWeight: 'bold' }}>{response.itinerary_name}</Typography>
      <Button
        variant="contained"
        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
        onClick={onSave}
        disabled={isSaving}
        sx={{
          backgroundColor: PRIMARY_RED,
          borderRadius: '25px',
          px: 4,
          '&:hover': { backgroundColor: '#b71c1c' }
        }}
      >
        {isSaving ? 'Saving...' : 'Save to My Itineraries'}
      </Button>
    </Box>

    <Box sx={{ display: 'flex', gap: 3, width: '100%', minHeight: '600px', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Map Section - Renders markers from ALL days */}
      <Box sx={{ flex: 1.2, borderRadius: 2, overflow: 'hidden', boxShadow: 3, height: '600px' }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            key={response.itinerary_name} 
            defaultZoom={13}
            defaultCenter={mapCenter} 
            mapId="DEMO_MAP_ID"
            style={{ width: '100%', height: '100%' }}
            gestureHandling={'greedy'}
            options={{ disableDefaultUI: false, clickableIcons: false }}
          >
            {mapMarkers.map((marker, index) => (
              <AdvancedMarker
                key={index}
                position={marker.position}
                title={`${marker.time} - ${marker.title}`}
              >
                <Pin background={PRIMARY_RED} glyphColor={'#ffff'} borderColor={'#000'} />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      </Box>

      {/* Itinerary List - Loops through all days provided by AI */}
      <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '600px', pr: 1 }}>
        {response.days.map((dayData) => (
          <Box key={dayData.day} sx={{ mb: 4 }}>
            <Typography
              variant='h6'
              sx={{
                bgcolor: LIGHT_RED,
                color: PRIMARY_RED,
                p: 1.5,
                mb: 2,
                borderRadius: '4px',
                fontWeight: 'bold',
                borderLeft: `6px solid ${PRIMARY_RED}`,
              }}
            >
              Day {dayData.day}
            </Typography>

            {dayData.itinerary.map((item, index) => (
              <Box key={index} sx={{ mb: 3, pl: 2, borderLeft: '2px solid #ddd', '&:hover': { borderLeftColor: PRIMARY_RED } }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.time}: {item.place_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1 }}>
                  {item.description}
                </Typography>
                {item.dining_option && item.dining_option.location && (
                  <Typography variant="body2" sx={{ color: PRIMARY_RED, fontWeight: 'bold', mt: 1 }}>
                    🍽️ Dining: {item.dining_option.location}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

// --- Main Component ---
export default function ItineraryPlanner() {
  const [place, setPlace] = useState(null);
  const [days, setDays] = useState(1);
  const [includeDining, setIncludeDining] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [fetchingLocations, setFetchingLocations] = useState(true);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const snackRef = useRef();

  // Fetch unique locations from database
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/locations');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setLocationOptions(data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      } finally {
        setFetchingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  // Map markers from ALL days
  const mapMarkers = useMemo(() => {
    if (!response?.days) return [];
    return response.days.flatMap(day =>
      day.itinerary
        .filter(item => item.coordinates?.lat && item.coordinates?.lng)
        .map(item => ({
          position: { lat: item.coordinates.lat, lng: item.coordinates.lng },
          title: item.place_name,
          time: item.time
        }))
    );
  }, [response]);

  const defaultCenter = { lat: 1.3521, lng: 103.8198 };
  const mapCenter = mapMarkers.length > 0 ? mapMarkers[0].position : defaultCenter;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!place) return;

    setLoading(true);
    setResponse(null);
    setError(null);

    const formData = {
      place: place,
      noOfDays: days,
      includeDining: includeDining
    };

    try {
      const res = await fetch('http://localhost:3000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.result);
      } else {
        throw new Error(data.message || 'Server error');
      }
    } catch (err) {
      setError('Failed to generate itinerary. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResponse(null);
    setPlace(null);
    setDays(1);
    setIncludeDining(false);
    setError(null);
  };

  const handleSaveItinerary = async () => {
    if (!response) return;
    setSaving(true);

    
    const userString = sessionStorage.getItem('user');
    
    
    let currentUserID = 1; 
    if (userString) {
      const userData = JSON.parse(userString);
      
      console.log(userData);

      currentUserID = userData.userID || userData.id || userData.user_id || 1;
    } else {
      alert('You must be logged in to save itineraries.');
      setSaving(false);
      return;
  }

  const savePayload = {
    userID: currentUserID,
    title: response.itinerary_name || `Trip to ${place}`,
    budgetLevel: "Moderate", 
    noOfDays: response.days.length,
    items: response.days 
  };
  
  try {
    const res = await fetch('http://localhost:3000/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(savePayload),
    });

    if (res.ok) {
      snackRef.current.handleState('Itinerary saved successfully!');
    } else {
      throw new Error('Failed to save');
    }
  } catch (err) {
    snackRef.current.handleState(err.message);
  } finally {
    setSaving(false);
  }
};

  return (
    <Box sx={backgroundStyles}>
      <Container maxWidth="lg">
        

        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: response ? 'center' : 'left' }}>
          {response ? 'Your Custom Itinerary' : 'Plan your trip in Singapore'}
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Form Section - Widened horizontally */}
          {!response && !loading && (
            <Grid item xs={12} md={10} lg={9}> 
              <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 2 }}>
                <Stack spacing={4} component="form" onSubmit={handleSubmit}>
                  <Typography variant='h5' sx={{ color: PRIMARY_RED, fontWeight: 'bold' }}>Where to go?</Typography>
                  <Autocomplete
                    fullWidth
                    options={locationOptions}
                    loading={fetchingLocations}
                    value={place}
                    onChange={(event, newValue) => setPlace(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Area"
                        variant="filled"
                        required
                        sx={{ bgcolor: LIGHT_RED, borderRadius: 1 }}
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                          endAdornment: (
                            <React.Fragment>
                              {fetchingLocations ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />

                  <Typography variant='h5' sx={{ color: PRIMARY_RED, fontWeight: 'bold' }}>Duration</Typography>
                  <TextField 
                    fullWidth
                    type="number"
                    label="Number of Days"
                    variant="filled"
                    value={days}
                    onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                    sx={{ bgcolor: LIGHT_RED, borderRadius: 1 }}
                    inputProps={{ min: 1, max: 14 }}
                  />

                  <Typography variant='h5' sx={{ color: PRIMARY_RED, fontWeight: 'bold' }}>Preferences</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={includeDining} 
                        onChange={(e) => setIncludeDining(e.target.checked)} 
                        sx={{ color: PRIMARY_RED, '&.Mui-checked': { color: PRIMARY_RED } }}
                      />
                    }
                    label="Include Dining Options"
                  />

                  <Button type='submit' variant='contained' size="large" fullWidth sx={{ py: 2, bgcolor: PRIMARY_RED, fontSize: '1.2rem' }} disabled={!place}>
                    Generate Itinerary
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          )}

          {/* Results Section - Centered results */}
          <Grid item xs={12}>
            {loading && (
              <Stack spacing={3} sx={{ alignItems: 'center', mt: 10 }}>
                <CircularProgress size={60} sx={{ color: PRIMARY_RED }} />
                <Typography variant="h6">Generating your itinerary...</Typography>
              </Stack>
            )}

            {error && (
               <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Alert severity="error" sx={{ maxWidth: '600px', width: '100%' }}>{error}</Alert>
               </Box>
            )}

            {response && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: '1100px' }}>
                  
                  {/* Generate Again Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<RefreshIcon />}
                      onClick={handleReset}
                      sx={{ 
                        color: PRIMARY_RED, 
                        borderColor: PRIMARY_RED,
                        borderRadius: '25px',
                        px: 4,
                        fontWeight: 'bold',
                        '&:hover': {
                          borderColor: '#b71c1c',
                          backgroundColor: LIGHT_RED
                        }
                      }}
                    >
                      Plan Another Trip
                    </Button>
                  </Box>

                  <ItineraryDisplay
                    response={response}
                    mapMarkers={mapMarkers}
                    mapCenter={mapCenter}
                    onSave={handleSaveItinerary}
                    isSaving={saving}
                  />
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      <SnackBarDialog ref={snackRef}></SnackBarDialog>
    </Box>
  );
}