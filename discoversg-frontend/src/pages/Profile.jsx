import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Container, Typography, Avatar, Button,
  Paper, TextField, Stack, Divider, Grid,
  Autocomplete,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { BACKEND_URL } from '../constants';

const ProfilePage = () => {
  const storedUser = JSON.parse(sessionStorage.getItem('user')) || {};

  const [profileData, setProfileData] = useState({
    name: storedUser.name || '',
    email: storedUser.email || '',
    password: '',
    description: storedUser.userDescription || '',
    profilePicUrl: storedUser.profilePicUrl || null
  });

  const [userPreferences, setUserPreferences] = useState({});
  const [locationOptions, setLocationOptions] = useState([]);
  const [fetchingLocations, setFetchingLocations] = useState(true);

  useEffect(() => {
    // Only fetch if storedUser exists
    if (!storedUser || !storedUser.id) return;

    fetch(`${BACKEND_URL}/api/retrieve-preferences/${storedUser.id}`)
      .then(res => res.json())
      .then(data => setUserPreferences(data));

    fetch(`${BACKEND_URL}/api/locations`)
      .then(res => res.json())
      .then(data => {
        setLocationOptions(data);
        setFetchingLocations(false);
      });
  }, []);

  const fileInputRef = useRef(null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setUserPreferences(prev => ({
      ...prev, // keep top-level fields like success
      preference: {
        ...prev.preference, // keep all existing preference fields
        [name]: value      // update only the field that changed
      }
    }));
  };

  const handleAutocompleteChange = (name, value) => {
    setUserPreferences(prev => ({
      ...prev,
      preference: {
        ...prev.preference,
        [name]: value // value is now the selected object/string from Autocomplete
      }
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

    if (file.size > MAX_FILE_SIZE) {
      alert(`File is too large! Max limit is 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      event.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setProfileData(prev => ({ ...prev, profilePicUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveAll = async () => {
    const profileBody = {
      userID: storedUser.userID || storedUser.id,
      userName: profileData.name,
      userEmail: profileData.email,
      userPassword: profileData.password,
      description: profileData.description,
      profilePicUrl: profileData.profilePicUrl
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileBody)
      });

      const data = await res.json();

      if (data.success) {
        const updatedUserLocal = {
          ...storedUser,
          name: profileData.name,
          email: profileData.email,
          userDescription: profileData.description,
          profilePicUrl: profileData.profilePicUrl
        };
        sessionStorage.setItem('user', JSON.stringify(updatedUserLocal));
        alert("Profile saved successfully!");
        setProfileData(prev => ({ ...prev, password: '' }));
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error) {
      alert("Error connecting to server.");
    }
  };

  const handleSavePreferences = async () => {
    const preferenceBody = {
      userID: storedUser.id,
      nearbyLocation: userPreferences.preference.nearbyLocation,
      budgetLevel: userPreferences.preference.budgetLevel,
      dietaryRequirements: userPreferences.preference.dietaryRequirements,
      otherNotes: userPreferences.preference.otherNotes
    }
    console.log(preferenceBody);

    try {
      const res = await fetch(`${BACKEND_URL}/api/update-preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferenceBody)
      });

      const data = await res.json();

      if (data.success) {
        alert("Preferences saved successfully!");
        setUserPreferences(prev => ({ ...prev }));
      }
    } catch (error) {
      alert("Error connecting to server.");
    }
  }

  return (
    <Box sx={{
      bgcolor: '#f9f9f9',
      minHeight: '100vh',
      py: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 5, borderRadius: 4, textAlign: 'center', bgcolor: '#ffffff' }}>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#c61a1a', textTransform: 'uppercase' }}>
            Edit Profile
          </Typography>

          {/* Avatar Upload Section */}
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 4 }}>
            <Avatar
              src={profileData.profilePicUrl}
              sx={{
                width: 150,
                height: 150,
                mx: 'auto',
                border: '4px solid #c61a1a',
                boxShadow: 2
              }}
            />
            <Button
              variant="contained"
              size="small"
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                borderRadius: '50%',
                minWidth: 40,
                width: 40,
                height: 40,
                bgcolor: '#c61a1a',
                '&:hover': { bgcolor: '#a01515' }
              }}
            >
              <CloudUploadIcon fontSize="small" />
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Update your personal information and profile picture.
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={5}>
            <Grid size={6}>
              <Typography variant="h6" align='left' sx={{ mb: 4, color: '#c61a1a' }}>
                Profile Details
              </Typography>
              {/* Profile Details fields */}
              <Stack spacing={3} sx={{ alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  variant="outlined"
                  value={profileData.name}
                  onChange={handleProfileChange}
                />
                <TextField
                  fullWidth
                  label="Bio / User Details"
                  name="description"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={profileData.description}
                  onChange={handleProfileChange}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  variant="outlined"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  placeholder="Leave blank to keep current"
                  value={profileData.password}
                  onChange={handleProfileChange}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSaveAll}
                  sx={{
                    bgcolor: '#c61a1a',
                    py: 1.5,
                    fontWeight: 'bold',
                    mt: 2,
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#a01515' }
                  }}
                >
                  Save Profile
                </Button>
              </Stack>
            </Grid>
            <Grid size={6}>
              <Typography variant="h6" align='left' sx={{ mb: 4, color: '#c61a1a' }}>
                Preferences
              </Typography>
              {/* Preference Fields */}
              <Stack spacing={3} sx={{ alignItems: 'center' }}>
                <Autocomplete
                  fullWidth
                  options={locationOptions}
                  loading={fetchingLocations}
                  value={userPreferences?.preference?.nearbyLocation ?? null}
                  onChange={(event, newValue) => {
                    handleAutocompleteChange('nearbyLocation', newValue);
                  }}
                  sx={{ backgroundColor: 'transparent' }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Nearby Location"
                      variant="filled"
                      sx={{ borderRadius: 1 }}
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
                <FormControl fullWidth>
                  <InputLabel id="budget-level-label">Budget Level</InputLabel>
                  <Select
                    fullWidth
                    labelId='budget-level-label'
                    label="Budget Level"
                    name="budgetLevel"
                    variant="outlined"
                    value={userPreferences?.preference?.budgetLevel || ""}
                    onChange={handlePreferenceChange}
                    sx={{
                      "& .MuiSelect-select": {
                        textAlign: "left",
                      },
                    }}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Dietary Requirements"
                  name="dietaryRequirements"
                  variant="outlined"
                  value={userPreferences?.preference?.dietaryRequirements || ""}
                  onChange={handlePreferenceChange}
                />
                <TextField
                  fullWidth
                  label="Other Information..."
                  name="otherNotes"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={userPreferences?.preference?.otherNotes || ""}
                  onChange={handlePreferenceChange}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSavePreferences}
                  sx={{
                    bgcolor: '#c61a1a',
                    py: 1.5,
                    fontWeight: 'bold',
                    mt: 2,
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#a01515' }
                  }}
                >
                  Save Preferences
                </Button>
              </Stack>

            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;