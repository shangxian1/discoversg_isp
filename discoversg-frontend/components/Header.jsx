import React from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/Twitter'; 


import logo from '../../assets/discoversg.png';

const Footer = () => {
  
  const socialMedia = [
    { icon: <FacebookIcon />, key: 'fb' },
    { icon: <InstagramIcon />, key: 'ig' },
    { icon: <XIcon />, key: 'x' },
  ];

  return (
    <Box sx={{ bgcolor: 'black', color: 'white', pt: 8, pb: 4, mt: 'auto' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Column 1 */}
          <Grid item xs={6} md={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['Activity', 'Food', 'Planner'].map((text) => (
                <Typography key={text} variant="body1" sx={{ textDecoration: 'underline', cursor: 'pointer', '&:hover': { color: '#ccc' } }}>
                  {text}
                </Typography>
              ))}
            </Box>
          </Grid>
          
          {/* Column 2 */}
          <Grid item xs={6} md={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['Itinerary', 'Feed', 'Contact us!'].map((text) => (
                <Typography key={text} variant="body1" sx={{ textDecoration: 'underline', cursor: 'pointer', '&:hover': { color: '#ccc' } }}>
                  {text}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
        
        {/* Bottom Bar */}
        <Box sx={{ 
          borderTop: '1px solid #333', 
          mt: 8, pt: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: 2
        }}>
          {/* Left: Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
             <Box
                  component="img"
                  sx={{ height: 50, width: 'auto', mr: 2 }}
                  alt="DiscoverSG Logo"
                  src={logo} 
              />
          </Box>

          {/* Center: Copyright */}
          <Typography variant="caption" sx={{ color: 'grey.500' }}>
            ©DiscoverSG - All rights reserved 2025
          </Typography>

          {/* Right: Social Icons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {socialMedia.map((item) => (
              <Box 
                key={item.key} 
                sx={{ 
                  width: 45, 
                  height: 45, 
                  borderRadius: '50%', 
                  bgcolor: '#196f75', 
                  display: 'flex',          
                  justifyContent: 'center', 
                  alignItems: 'center',     
                  color: 'white',           
                  cursor: 'pointer',
                  transition: '0.3s',
                  '&:hover': { bgcolor: 'secondary.light' }
                }} 
              >
                {item.icon}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;