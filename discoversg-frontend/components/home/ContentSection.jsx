import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';

const ContentSection = () => {
  // Helper internal component
  const PlaceholderBox = ({ height }) => (
    <Box sx={{ width: '100%', height: height, bgcolor: '#e0e0e0', borderRadius: 2 }} />
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Offers</Typography>
      <Grid container spacing={2} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}><PlaceholderBox height={200} /></Grid>
        <Grid item xs={12} md={6}><PlaceholderBox height={200} /></Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2 }}>Featured:</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}><PlaceholderBox height={180} /></Grid>
        <Grid item xs={12} md={4}><PlaceholderBox height={180} /></Grid>
        <Grid item xs={12} md={4}><PlaceholderBox height={180} /></Grid>
      </Grid>
    </Container>
  );
};

export default ContentSection;