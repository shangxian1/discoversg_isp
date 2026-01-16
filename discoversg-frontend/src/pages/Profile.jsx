import React, { useState, useRef } from 'react';
import { 
    Box, Container, Typography, Avatar, Button, 
    Paper, TextField, Stack, Divider, Alert 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ProfilePage = () => {
    const storedUser = JSON.parse(sessionStorage.getItem('user')) || {};

    const [profileData, setProfileData] = useState({
        name: storedUser.name || '',
        email: storedUser.email || '',
        password: '', 
        description: storedUser.userDescription || '',
        profilePicUrl: storedUser.profilePicUrl || null
    });

    const fileInputRef = useRef(null);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
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
            const res = await fetch('http://localhost:3000/api/update-profile', {
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

    return (
        <Box sx={{ 
            bgcolor: '#f9f9f9', 
            minHeight: '100vh', 
            py: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Container maxWidth="sm">
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

                    <Divider sx={{ mb: 4 }} />

                    {/* Form Fields - Stacked and Centered */}
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
                            Save All Changes
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default ProfilePage;