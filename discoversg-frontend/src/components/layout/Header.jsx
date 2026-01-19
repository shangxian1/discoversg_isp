import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Avatar, IconButton, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import { AccountCircle, Book, Login as LoginIcon, Logout, RunCircleRounded } from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '/assets/discoversg.png';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Initialize state with current session storage data
    const [userData, setUserData] = useState(JSON.parse(sessionStorage.getItem('user')));
    const [accountMenu, setAccountMenu] = useState(null);
    const open = Boolean(accountMenu);

    const handleClick = (event) => {
        setAccountMenu(event.currentTarget);
    };
    const handleClose = () => {
        setAccountMenu(null);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        window.location.href = '/';
    };

    // 2. Listen for storage changes to update the bubble instantly
    useEffect(() => {
        const handleStorageChange = () => {
            setUserData(JSON.parse(sessionStorage.getItem('user')));
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
                            <>
                                <IconButton
                                    onClick={handleClick}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
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
                                <Menu
                                    anchorEl={accountMenu}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    slotProps={{
                                        paper: {
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 0.5,
                                                '&::before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 23,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'white',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={() => navigate('/profile')} sx={{padding: '0.5rem'}}>
                                        <ListItemIcon>
                                            <AccountCircle />
                                        </ListItemIcon>
                                        Account Details
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/your-activities')} sx={{padding: '0.5rem'}}>
                                        <ListItemIcon>
                                            <RunCircleRounded />
                                        </ListItemIcon>
                                        Your Activities
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/itinerary')} sx={{padding: '0.5rem'}}>
                                        <ListItemIcon>
                                            <Book />
                                        </ListItemIcon>
                                        Your Itineraries
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleLogout} sx={{padding: '0.5rem'}}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
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