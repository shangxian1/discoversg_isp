import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Avatar, IconButton } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/discoversg.png'; 

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 1. Initialize state with current localStorage data
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')));

    // 2. Listen for storage changes to update the bubble instantly
    useEffect(() => {
        const handleStorageChange = () => {
            setUserData(JSON.parse(localStorage.getItem('user')));
        };

        // Listen for the custom event dispatched from ProfilePage
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const navItems = [
        { name: 'Activities', path: '/activities' },
        { name: 'Feed', path: '/feed' },
        { name: 'Planner', path: '/planner' }
    ];

    if (userData) {
        navItems.push({ name: 'Itinerary', path: '/itinerary' });
    }

    return (
        <AppBar position="static" color="primary" elevation={0} sx={{ width: '100%', bgcolor: '#c61a1a' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    
                    {/* Logo Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 6 }}>
                        <Box component={RouterLink} to="/" sx={{ height: 50, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <Box component="img" sx={{ height: 40, width: 'auto' }} alt="DiscoverSG Logo" src={logo} />
                        </Box>
                    </Box>

                    {/* Navigation Links */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, mr: 6 }}>
                        {navItems.map((item) => (
                            <Typography 
                                key={item.name}
                                component={RouterLink} 
                                to={item.path}
                                variant="body1" 
                                sx={{ 
                                    fontWeight: 500,
                                    textDecoration: 'none', 
                                    color: 'white',
                                    borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                                    pb: 0.5 
                                }}
                            >
                                {item.name}
                            </Typography>
                        ))}
                    </Box>

                    {/* Dynamic Auth Section */}
                    <Box sx={{ display: 'flex', gap: 2, marginLeft: 'auto', alignItems: 'center' }}>
                        {userData ? (
                            <IconButton onClick={() => navigate('/profile')} sx={{ p: 0 }}>
                                <Avatar 
                                    // 3. PRIORITIZE THE UPLOADED IMAGE URL
                                    src={userData.profilePicUrl} 
                                    sx={{ 
                                        bgcolor: '#b39ddb', 
                                        border: '2px solid white',
                                        width: 45,
                                        height: 45
                                    }}
                                >
                                    {/* 4. FALLBACK TO INITIAL IF NO IMAGE EXISTS */}
                                    {!userData.profilePicUrl && (userData.name?.charAt(0).toUpperCase() || 'U')}
                                </Avatar>
                            </IconButton>
                        ) : (
                            <>
                                <Button component={RouterLink} to="/login" variant="contained" color="secondary" sx={{ borderRadius: 5, textTransform: 'none' }}>
                                    Login
                                </Button>
                                <Button component={RouterLink} to="/signup" variant="contained" color="secondary" endIcon={<LoginIcon />} sx={{ borderRadius: 5, textTransform: 'none' }}>
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;