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
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  LocalizationProvider,
  DatePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Google Maps Components
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

// --- Constants & Styles ---
const BACKGROUND_STRIPE_COLOR = 'rgba(255, 255, 255, 0.7)';
const LIGHT_RED = '#fce4e4';
const PRIMARY_RED = '#d32f2f';
const GOOGLE_MAPS_API_KEY = 'AIzaSyBU06pEAaWjEm9e6uJtP1ks0EID4aMAxF4'; // Use your API key

const backgroundStyles = {
  backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, ${BACKGROUND_STRIPE_COLOR} 10px, ${BACKGROUND_STRIPE_COLOR} 20px)`,
  backgroundSize: '40px 100%',
  minHeight: '100vh',
  flexGrow: 1,
  padding: '40px 0',
};

// --- Sub-component: Itinerary Display ---
const ItineraryDisplay = ({ response, mapMarkers, mapCenter, defaultCenter, onSave, isSaving }) => (
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

    <Box sx={{ display: 'flex', gap: 3, width: '100%', height: '600px', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Map Section */}
      <Box sx={{ flex: 1.2, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultZoom={13}
            defaultCenter={defaultCenter}
            center={mapCenter}
            mapId="DEMO_MAP_ID"
            style={{ width: '100%', height: '100%' }}
            options={{
              draggable: true,
              scrollwheel: true,
              zoomControl: true,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
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

      {/* Itinerary Scrollable Text */}
      <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '600px', pr: 1 }}>
        {response.days.map((day) => (
          <Box key={day.day} sx={{ mb: 4 }}>
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
              Day {day.day}
            </Typography>

            {day.itinerary.map((item, index) => (
              <Box key={index} sx={{ mb: 3, pl: 2, borderLeft: '2px solid #ddd', '&:hover': { borderLeftColor: PRIMARY_RED } }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.time}: {item.place_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1 }}>
                  {item.description}
                </Typography>
                {item.dining_option && (
                  <Typography variant="body2" sx={{ color: PRIMARY_RED, fontWeight: 500 }}>
                    🍽 Dining: {item.dining_option.location}
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
  const [place, setPlace] = useState('woodlands');
  const [selectedDate, setSelectedDate] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Map Data Extraction
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
    setLoading(true);
    setResponse(null);
    setError(null);

    const formData = {
      place: place,
      travelDate: selectedDate ? selectedDate.format('YYYY-MM-DD') : 'Flexible'
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

  // --- SAVE FUNCTIONALITY ---
  const handleSaveItinerary = async () => {
    if (!response) return;
    setSaving(true);

    // Format the AI response to match the SQL/ItineraryPage schema
    const savePayload = {
      title: response.itinerary_name || `Trip to ${place}`,
      budgetLevel: "Moderate", // AI can be prompted to provide this, or set default
      noOfDays: response.days.length,
      // Mapping nested "days" to a flat list of items for the backend
      items: response.days.flatMap(day => 
        day.itinerary.map(item => ({
          dayNumber: day.day,
          activityName: item.place_name,
          location: item.place_name,
          startTime: item.time, // Matches format expected by ItineraryPage
          notes: item.description,
          activityPicUrl: "_" // Default placeholder
        }))
      )
    };

    try {
      const res = await fetch('http://localhost:3000/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savePayload),
      });

      if (res.ok) {
        setSnackbar({ open: true, message: 'Itinerary saved successfully!', severity: 'success' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save itinerary.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={backgroundStyles}>
      <Container maxWidth="lg">
        {/* Top Bar */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', maxWidth: 450, backgroundColor: LIGHT_RED, borderRadius: '25px' }}>
              <IconButton sx={{ p: '10px' }}><SearchIcon /></IconButton>
              <TextField placeholder="Search Singapore..." variant="standard" fullWidth InputProps={{ disableUnderline: true }} sx={{ ml: 1, flex: 1 }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button variant="contained" sx={{ backgroundColor: LIGHT_RED, color: PRIMARY_RED, borderRadius: '25px', px: 3, boxShadow: 'none' }} startIcon={<FavoriteIcon />}>
              My Itineraries
            </Button>
          </Grid>
        </Grid>

        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          {response ? 'Your Custom Itinerary' : 'Plan your trip'}
        </Typography>

        <Grid container spacing={4}>
          {/* Form Section */}
          {!response && !loading && (
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                  <Typography variant='h6' sx={{ color: PRIMARY_RED, fontWeight: 'bold' }}>Where to go?</Typography>
                  <FormControl fullWidth variant='filled'>
                    <InputLabel>Select Area</InputLabel>
                    <Select value={place} onChange={(e) => setPlace(e.target.value)} disableUnderline sx={{ bgcolor: LIGHT_RED, borderRadius: 1 }}>
                      <MenuItem value={'woodlands'}>Woodlands</MenuItem>
                      <MenuItem value={'changi'}>Changi Airport</MenuItem>
                      <MenuItem value={'sentosa'}>Sentosa</MenuItem>
                      <MenuItem value={'marina bay'}>Marina Bay</MenuItem>
                      <MenuItem value={'chinatown'}>Chinatown</MenuItem>
                    </Select>
                  </FormControl>

                  <Typography variant='h6' sx={{ color: PRIMARY_RED, fontWeight: 'bold' }}>Travel Date</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      slotProps={{ textField: { fullWidth: true, variant: 'filled', sx: { bgcolor: LIGHT_RED } } }}
                    />
                  </LocalizationProvider>

                  <Button type='submit' variant='contained' size="large" sx={{ py: 2, bgcolor: PRIMARY_RED, fontSize: '1.1rem' }}>
                    Generate
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          )}

          {/* Results / Loading Section */}
          <Grid item xs={12} md={response ? 12 : 7}>
            {loading && (
              <Stack spacing={3} sx={{ alignItems: 'center', mt: 10 }}>
                <CircularProgress size={60} sx={{ color: PRIMARY_RED }} />
                <Typography variant="h6">Generating your itinerary...</Typography>
              </Stack>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {response && (
              <ItineraryDisplay
                response={response}
                mapMarkers={mapMarkers}
                mapCenter={mapCenter}
                defaultCenter={defaultCenter}
                onSave={handleSaveItinerary}
                isSaving={saving}
              />
            )}

            
          </Grid>
        </Grid>
      </Container>

      {/* Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}