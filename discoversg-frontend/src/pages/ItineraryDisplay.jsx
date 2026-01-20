import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Grid, Stack, Typography, Button, Alert, CircularProgress
} from '@mui/material';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';

// Custom Component
import SnackBarDialog from '../components/layout/SnackBar';

// --- Constants ---
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const PRIMARY_RED = '#d32f2f';
const LIGHT_RED = '#fce4e4';

export default function ItineraryDisplay() {
  const location = useLocation();
  const navigate = useNavigate();
  const snackRef = useRef();
  const [isSaving, setSaving] = useState(false);

  const [response, setResponse] = useState(location.state?.response || null);
  const [place, setPlace] = useState(location.state?.place || '');
  const [error, setError] = useState(location.state?.error || null);

  useEffect(() => {
    if (!response) {
      const stored = sessionStorage.getItem('itineraryResponse');
      if (stored) setResponse(JSON.parse(stored));
    }
  }, []);
  
  // Map markers
  const mapMarkers = useMemo(() => {
    if (!response?.days) return [];
    return response.days.flatMap(day =>
      day.itinerary
        .filter(item => item.coordinates?.lat && item.coordinates?.lng)
        .map(item => ({
          position: { lat: item.coordinates.lat, lng: item.coordinates.lng },
          title: item.place_name,
          time: item.time,
        }))
    );
  }, [response]);

  const defaultCenter = { lat: 1.3521, lng: 103.8198 };
  const mapCenter = mapMarkers.length > 0 ? mapMarkers[0].position : defaultCenter;

  if (!response && !error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6">No itinerary found.</Typography>
        <Button variant="contained" onClick={() => navigate('/itinerary')}>Go Back</Button>
      </Box>
    );
  }

  const handleReset = () => {
    sessionStorage.removeItem('itineraryResponse');
    sessionStorage.removeItem('itineraryPlace');
    navigate('/itinerary');
  };

  const handleSaveItinerary = async () => {
    if (!response) return;
    setSaving(true);

    const userString = sessionStorage.getItem('user');
    let currentUserID = 1;

    if (userString) {
      const userData = JSON.parse(userString);
      currentUserID = userData.userID || userData.id || userData.user_id || 1;
    } else {
      alert('You must be logged in to save itineraries.');
      setSaving(false);
      return;
    }

    const savePayload = {
      userID: currentUserID,
      title: response.itinerary_name || `Trip to ${place}`,
      budgetLevel: 'Moderate',
      noOfDays: response.days.length,
      items: response.days,
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
    <Grid item xs={12}>
      {error && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Alert severity="error" sx={{ maxWidth: '600px', width: '100%' }}>{error}</Alert>
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '1100px' }}>
          {/* Generate Again Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: 4 }}>
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
                '&:hover': { borderColor: '#b71c1c', backgroundColor: LIGHT_RED },
              }}
            >
              Plan Another Trip
            </Button>
          </Box>

          <Box sx={{ width: '100%', marginBottom: 4 }}>
            {/* Header with Save Option */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {response.itinerary_name || `Trip to ${place}`}
              </Typography>
              <Button
                variant="contained"
                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSaveItinerary}
                disabled={isSaving}
                sx={{
                  backgroundColor: PRIMARY_RED,
                  borderRadius: '25px',
                  px: 4,
                  '&:hover': { backgroundColor: '#b71c1c' },
                }}
              >
                {isSaving ? 'Saving...' : 'Save to My Itineraries'}
              </Button>
            </Box>

            {/* Layout: Map + Itinerary list */}
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                width: '100%',
                minHeight: '600px',
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              {/* Map Section */}
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
                      <AdvancedMarker key={index} position={marker.position} title={`${marker.time} - ${marker.title}`}>
                        <Pin background={PRIMARY_RED} glyphColor={'#ffff'} borderColor={'#000'} />
                      </AdvancedMarker>
                    ))}
                  </Map>
                </APIProvider>
              </Box>

              {/* Itinerary List */}
              <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '600px', pr: 1 }}>
                {response.days.map((dayData) => (
                  <Box key={dayData.day} sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
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
                      <Box
                        key={index}
                        sx={{
                          mb: 3,
                          pl: 2,
                          borderLeft: '2px solid #ddd',
                          '&:hover': { borderLeftColor: PRIMARY_RED },
                        }}
                      >
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
        </Box>
      </Box>
      <SnackBarDialog ref={snackRef} />
    </Grid>
  );
}
