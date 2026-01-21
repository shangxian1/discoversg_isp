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
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../constants';
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

// --- Main Component ---
export default function ItineraryPlanner() {
  const [place, setPlace] = useState(null);
  const [days, setDays] = useState(1);
  const [includeDining, setIncludeDining] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const [fetchingLocations, setFetchingLocations] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const snackRef = useRef();
  const navigate = useNavigate();

  // Fetch unique locations from database
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/locations`);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!place) return;

    setLoading(true);
    setError(null);

    const formData = {
      place: place,
      noOfDays: days,
      includeDining: includeDining
    };

    try {
      const res = await fetch('http://${BACKEND_URL}:3000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        //Store generated itinerary into session storage
        sessionStorage.setItem('itineraryResponse', JSON.stringify(data.result));
        sessionStorage.setItem('itineraryPlace', place);
        navigate('/planner-result', { state: { response: data.result, place, error } });
      } else {
        throw new Error(data.message || 'Server error');
      }
    } catch (err) {
      setError('Failed to generate itinerary. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={backgroundStyles}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'left' }}>
          {'Plan your trip in Singapore'}
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Form Section - Widened horizontally */}
          {!loading && (
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
                    {loading ? 'Generating...' : 'Generate Itinerary'}
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          )}
          {loading && (
            <Stack spacing={3} sx={{ alignItems: 'center', mt: 10 }}>
              <CircularProgress size={60} sx={{ color: PRIMARY_RED }} />
              <Typography variant="h6">Generating your itinerary...</Typography>
            </Stack>
          )}
        </Grid>
      </Container>

      <SnackBarDialog ref={snackRef}></SnackBarDialog>
    </Box>
  );
}