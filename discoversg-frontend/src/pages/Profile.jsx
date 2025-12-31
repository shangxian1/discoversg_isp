import React, { useState, useRef } from 'react';
import { Box, Container, Grid, Typography, Avatar, Button, Paper, TextField } from '@mui/material';

const ProfilePage = () => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};

    const [profileData, setProfileData] = useState({
        name: storedUser.name || '',
        email: storedUser.email || '',
        password: '', 
        description: storedUser.userDescription || '',
        profilePicUrl: storedUser.profilePicUrl || null
    });

    const [preferences, setPreferences] = useState({
        location: '',
        dietary: '',
        budget: ''
    });

    const fileInputRef = useRef(null);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePrefChange = (e) => {
        const { name, value } = e.target;
        setPreferences(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileData(prev => ({ ...prev, profilePicUrl: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleSaveAll = async () => {
        const profileBody = {
            userID: storedUser.id,
            userName: profileData.name,
            userEmail: profileData.email,
            userPassword: profileData.password,
            description: profileData.description,
            profilePicUrl: profileData.profilePicUrl
        };

        const prefBody = {
            userID: storedUser.id,
            nearbyLocation: preferences.location,
            budgetLevel: preferences.budget,
            dietaryRequirements: preferences.dietary
        };

        try {
            const res1 = await fetch('http://localhost:3000/api/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileBody)
            });
            const res2 = await fetch('http://localhost:3000/api/update-preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prefBody)
            });

            const data1 = await res1.json();
            const data2 = await res2.json();

            if (data1.success && data2.success) {
                const updatedUserLocal = { 
                    ...storedUser, 
                    name: profileData.name, 
                    email: profileData.email, 
                    userDescription: profileData.description, 
                    profilePicUrl: profileData.profilePicUrl 
                };
                localStorage.setItem('user', JSON.stringify(updatedUserLocal));
                alert("Profile and Preferences saved!");
                setProfileData(prev => ({ ...prev, password: '' })); 
                window.dispatchEvent(new Event("storage")); 
            }
        } catch (error) {
            alert("Connection error. Ensure backend is running on port 3000.");
        }
    };

    return (
        <Box sx={{ bgcolor: '#fdf2f2', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={8} justifyContent="center">
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar src={profileData.profilePicUrl} onClick={() => fileInputRef.current.click()} sx={{ width: 180, height: 180, bgcolor: '#eee', mb: 2, cursor: 'pointer', border: '1px solid #ddd' }} />
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                        <Button variant="contained" onClick={handleSaveAll} sx={{ bgcolor: '#c61a1a', mb: 4 }}>Save All Changes</Button>
                        
                        <Typography variant="h6" sx={{ alignSelf: 'flex-start', mb: 1 }}>Preferences:</Typography>
                        <Paper sx={{ p: 3, bgcolor: '#d9d9d9', width: '100%' }}>
                            {Object.keys(preferences).map((key) => (
                                <Box key={key} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography sx={{ width: 100, fontWeight: 500, textTransform: 'capitalize' }}>{key}:</Typography>
                                    <TextField name={key} variant="standard" value={preferences[key]} onChange={handlePrefChange} InputProps={{ disableUnderline: true, sx: { bgcolor: 'white', px: 1, borderRadius: 1 } }} />
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ width: 140, fontWeight: 'bold' }}>Name:</Typography><TextField fullWidth name="name" variant="filled" size="small" value={profileData.name} onChange={handleProfileChange} /></Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ width: 140, fontWeight: 'bold' }}>User details:</Typography><TextField fullWidth name="description" variant="filled" size="small" value={profileData.description} onChange={handleProfileChange} /></Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ width: 140, fontWeight: 'bold' }}>Email:</Typography><TextField fullWidth name="email" variant="filled" size="small" value={profileData.email} onChange={handleProfileChange} /></Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ width: 140, fontWeight: 'bold' }}>Password:</Typography><TextField fullWidth name="password" type="password" variant="filled" size="small" placeholder="••••••••" value={profileData.password} onChange={handleProfileChange} /></Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ProfilePage;