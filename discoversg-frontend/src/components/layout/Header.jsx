import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
// 1. Import Link and useLocation from react-router-dom
import { Link as RouterLink, useLocation } from 'react-router-dom';
import logo from '../../assets/discoversg.png'; // Updated Path

const Navbar = () => {
    const location = useLocation(); // Hook to get current path for styling active link
    const navItems = [
        { name: 'Activities', path: '/activities' },      // Assuming home/main page is activities
        { name: 'Feed', path: '/feed' },
        { name: 'Planner', path: '/planner' }   // The target route for the itinerary planner
    ];

    return (
        <AppBar position="static" color="primary" elevation={0} sx={{ width: '100%' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    
                    {/* Logo Section - Make logo link to home */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 6 }}>
                        <Box
                            component={RouterLink} // 2. Make the logo linkable to home
                            to="/"
                            sx={{ height: 50, width: 'auto', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                        >
                            <Box
                                component="img"
                                sx={{ height: 50, width: 'auto' }}
                                alt="DiscoverSG Logo"
                                src={logo} 
                            />
                        </Box>
                    </Box>

                    {/* Navigation Links */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, mr: 6 }}>
                        {navItems.map((item) => (
                            // 3. Replace Typography with a RouterLink and wrap in Box for spacing
                            <Box key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography 
                                    component={RouterLink} // Use RouterLink component
                                    to={item.path}
                                    variant="body1" 
                                    sx={{ 
                                        cursor: 'pointer', 
                                        fontWeight: 500,
                                        textDecoration: 'none', 
                                        color: 'white', // Ensure link color is white
                                        // Optional: Highlight the active link
                                        borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                                        pb: 0.5 // Padding bottom for the border line
                                    }}
                                >
                                    {item.name}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Auth Buttons - Assuming Login links to /login */}
                    <Box sx={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            component={RouterLink} // Make Login Button a link
                            to="/login"
                            sx={{ borderRadius: 5, textTransform: 'none' }}
                        >
                            Login
                        </Button>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            endIcon={<LoginIcon />} 
                            component={RouterLink} // Make Sign Up Button a link
                            to="/signup" // Assuming you have a /signup route
                            sx={{ borderRadius: 5, textTransform: 'none', whiteSpace: 'nowrap' }}
                        >
                            Sign Up
                        </Button>
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;