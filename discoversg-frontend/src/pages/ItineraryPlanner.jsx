import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  LocalizationProvider,
  DatePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

// Icons for the Top Bar
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Import Google Maps Components
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';


// Define the colors/styles from the image for consistency
const BACKGROUND_STRIPE_COLOR = 'rgba(255, 255, 255, 0.7)'; // White/pink stripe
const LIGHT_RED = '#fce4e4'; // Light background color often used for lighter input fields
const PRIMARY_RED = '#d32f2f'; // Primary color for accents

const GOOGLE_MAPS_API_KEY = 'AIzaSyBU06pEAaWjEm9e6uJtP1ks0EID4aMAxF4'; // Use your API key

// --- Custom Background Style ---
const backgroundStyles = {
  backgroundImage: `repeating-linear-gradient(
    90deg,
    transparent,
    transparent 10px,
    ${BACKGROUND_STRIPE_COLOR} 10px,
    ${BACKGROUND_STRIPE_COLOR} 20px
  )`,
  backgroundSize: '40px 100%',
  flexGrow: 1,
  padding: '40px 0',
};

// Component to display the Itinerary result
const ItineraryDisplay = ({ response, mapMarkers, mapCenter, defaultCenter }) => (
  <Box sx={{ display: 'flex', gap: 3, width: '100%', height: '500px' }}>
    {/* Map on the left */}
    <Box sx={{ flex: 1, borderRadius: 2, overflow: 'hidden' }}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultZoom={13}
          defaultCenter={defaultCenter}
          center={mapCenter}
          mapId="DEMO_MAP_ID"
          style={{ width: '100%', height: '100%' }}
          options={{
            draggable: true,          // Allow dragging
            scrollwheel: true,        // Allow zooming with mouse wheel
            zoomControl: true,        // Show zoom buttons
            mapTypeControl: true,     // Optional: type selector
            streetViewControl: true,  // Optional: street view icon
            fullscreenControl: true,  // Optional: fullscreen toggle
          }}// important!
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

    {/* Itinerary text on the right */}
    <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '500px' }}>
      <Typography variant='h4' gutterBottom>{response.itinerary_name}</Typography>
      {response.days.map((day) => (
        <Box key={day.day} sx={{ mb: 4 }}>
          <Typography
            variant='h6'
            sx={{
              bgcolor: LIGHT_RED,
              color: PRIMARY_RED,
              p: 1,
              mb: 2,
              borderLeft: `5px solid ${PRIMARY_RED}`,
            }}
          >
            Day {day.day}
          </Typography>

          {day.itinerary.map((item, index) => (
            <Box key={index} sx={{ mb: 3, pl: 2, borderLeft: '1px solid #ddd' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {item.time}: {item.place_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {item.description}
              </Typography>
              {item.dining_option && (
                <Typography variant="body2" sx={{ color: PRIMARY_RED }}>
                  🍽 Dining: {item.dining_option.location}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  </Box>
);


export default function TripPlanner() {
  const [place, setPlace] = useState('woodlands');
  const [selectedDate, setSelectedDate] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(response);

  // 2. Helper to extract markers from the nested JSON structure
  const mapMarkers = useMemo(() => {
    if (!response || !response.days) return [];

    const markers = [];
    response.days.forEach(day => {
      day.itinerary.forEach(item => {
        if (item.coordinates && item.coordinates.lat && item.coordinates.lng) {
          markers.push({
            position: { lat: item.coordinates.lat, lng: item.coordinates.lng },
            title: item.place_name,
            time: item.time
          });
        }
      });
    });
    return markers;
  }, [response]);
  console.log(mapMarkers);

  // Default Singapore center
  const defaultCenter = { lat: 1.3521, lng: 103.8198 };

  // Calculate dynamic center based on the first result if available
  const mapCenter = mapMarkers.length > 0 ? mapMarkers[0].position : defaultCenter;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null); // Clear previous results while loading
    setError(null);

    const formData = {
      place: place,
      travelDate: selectedDate ? selectedDate.format('YYYY-MM-DD') : 'No date selected'
    }

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

    } catch (error) {
      console.error('API Error:', error);
      setError('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container with the striped background
    <Box sx={backgroundStyles}>
      <Container maxWidth="lg">

        {/* --- Top Bar: Search and Itinerary Button --- */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>

          {/* Search Bar (Replaced with a placeholder for now as it's not part of the AI logic) */}
          <Grid item xs={12} md={8}>
            <Paper
              component="form"
              elevation={0}
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: 450,
                backgroundColor: LIGHT_RED,
                borderRadius: '25px',
              }}
            >
              <IconButton sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <TextField
                placeholder="Search"
                variant="standard"
                fullWidth
                InputProps={{ disableUnderline: true }}
                sx={{ ml: 1, flex: 1 }}
              />
            </Paper>
          </Grid>

          {/* Itinerary Button */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: LIGHT_RED,
                color: PRIMARY_RED,
                borderRadius: '25px',
                px: 3,
                py: 1,
                fontSize: '0.9rem',
                boxShadow: 'none',
                '&:hover': { backgroundColor: LIGHT_RED },
              }}
              startIcon={<FavoriteIcon sx={{ color: PRIMARY_RED }} />}
            >
              Itinerary (1)
            </Button>
          </Grid>
        </Grid>

        {/* --- Main Content Layout --- */}
        <Typography component="h2" variant="h4" sx={{ mb: 4, color: '#333' }}>
          Plan your trip
        </Typography>

        <Grid container spacing={4}>

          {/* LEFT COLUMN: FORM (only show if no response yet) */}
          {!response && (
            <Grid item xs={12} md={5}>
              <Box
                component={'form'}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  p: 3,
                  backgroundColor: 'white',
                  borderRadius: 2
                }}
                onSubmit={handleSubmit}
              >
                <Typography variant='h6' sx={{ color: PRIMARY_RED }}>Where do you want to go?</Typography>

                {/* Location Select */}
                <FormControl fullWidth variant='filled' sx={{ '.MuiFilledInput-root': { backgroundColor: LIGHT_RED, borderRadius: '4px' } }}>
                  <InputLabel id="area-label">Area</InputLabel>
                  <Select
                    labelId="area-label"
                    value={place}
                    label="Area"
                    onChange={(event) => setPlace(event.target.value)}
                    disableUnderline={true}
                  >
                    <MenuItem value={'woodlands'}>Woodlands</MenuItem>
                    <MenuItem value={'changi'}>Changi Airport</MenuItem>
                    <MenuItem value={'sentosa'}>Sentosa</MenuItem>
                    <MenuItem value={'marina bay'}>Marina Bay</MenuItem>
                    <MenuItem value={'chinatown'}>Chinatown</MenuItem>
                    <MenuItem value={'east coast'}>East Coast</MenuItem>
                    <MenuItem value={'tampines'}>Tampines</MenuItem>
                    <MenuItem value={'ang mo kio'}>Ang Mo Kio</MenuItem>
                    <MenuItem value={'simei'}>Simei</MenuItem>
                  </Select>
                </FormControl>

                <Typography variant='h6' sx={{ mt: 2, color: PRIMARY_RED }}>Trip dates</Typography>

                {/* Date Picker */}
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Date"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: 'filled',
                            InputProps: { disableUnderline: true },
                            sx: { '.MuiFilledInput-root': { backgroundColor: LIGHT_RED, borderRadius: '4px' } }
                          },
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>

                {/* Generate Button */}
                <Button
                  size="large"
                  variant='contained'
                  type='submit'
                  sx={{
                    mt: 4,
                    backgroundColor: PRIMARY_RED,
                    '&:hover': { backgroundColor: '#a31515' },
                    py: 1.5,
                    fontSize: '1.2rem',
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Itinerary'}
                </Button>
              </Box>
            </Grid>
          )}

          {/* RIGHT COLUMN: RESULTS + MAP */}
          <Grid item xs={12} md={response ? 12 : 7}>
            {error && <Typography color="error">{error}</Typography>}

            {!response && !loading && (
              <Box>
                <Typography variant='h6' sx={{ mb: 1 }}>Interactive Map</Typography>
                <Box
                  sx={{
                    height: 400,
                    backgroundColor: '#e0e0e0',
                    border: '1px solid #ccc',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h5" color="text.secondary">Map will appear here after generation</Typography>
                </Box>
                <Typography variant='h6' sx={{ textAlign: 'center', color: 'gray', mt: 5 }}>
                  Your generated itinerary will appear here.
                </Typography>
              </Box>
            )}

            {loading && (
              <Stack spacing={2} sx={{ alignItems: 'center', mt: 5 }}>
                <CircularProgress size="4rem" />
                <Typography>Generating AI response...</Typography>
              </Stack>
            )}

            {response && (
              <ItineraryDisplay
                response={response}
                mapMarkers={mapMarkers}
                mapCenter={mapCenter}
                defaultCenter={defaultCenter}
              />
            )}
          </Grid>
        </Grid>


      </Container>
    </Box>
  );
}