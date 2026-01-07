import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CardActionArea
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import pearlHillImg from '../../assets/pearl_hill.jpg';
import japaneseCemeteryImg from '../../assets/japanese_cemetery.jpg';
import hampsteadImg from '../../assets/hampstead_wetlands.jpg';

const ContentSection = () => {

  // Card component for each hidden gem
  const GemCard = ({ title, location, category, image }) => (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <CardActionArea sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardMedia
          component="img"
          height="240"
          image={image}
          alt={title}
          sx={{ objectFit: 'cover', width: '100%' }}
        />
        <CardContent sx={{ width: '100%' }}>
          <Chip
            label={category}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 'bold', mb: 1 }}
          />
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary' }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2">{location}</Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>

      {/* Header */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>
        Uncover the Unseen
      </Typography>

      {/* Campaign Section */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: '#e3f2fd',
            border: '1px solid #bbdefb',
            backgroundImage: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)'
          }}>
            <Typography variant="overline" color="primary" fontWeight="bold">
              Limited Time
            </Typography>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              SingapoRewards 2026
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Eligible visitors can redeem one free "off-the-beaten-path" experience.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: '#f1f8e9',
            border: '1px solid #dcedc8',
            backgroundImage: 'linear-gradient(135deg, #f1f8e9 0%, #ffffff 100%)'
          }}>
            <Typography variant="overline" color="success.main" fontWeight="bold">
              New Trail
            </Typography>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              The Last Fishing Village
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Explore Seletar’s rustic past and catch breathtaking sunsets by the jetties.
            </Typography>
            <Button variant="outlined" color="success" sx={{ borderRadius: 2 }}>
              View Itinerary
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Featured 3-Column Section */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Recommended For You
      </Typography>

      <Grid
        container
        spacing={3}
        // This ensures the row doesn't break if there's a tiny bit of overflow
        wrap="wrap"
        sx={{
          width: '100%',
          margin: 0,
          // This ensures that on screens 900px and wider, it MUST stay 3 columns
          '& .MuiGrid-item': {
            display: 'flex'
          }
        }}
      >
        {/* We use xs={12} for mobile, but sm={4} to force 3 columns earlier (at 600px+) */}
        {[
          { title: "Pearl's Hill City Park", loc: "Near Outram Park", cat: "Nature", img: pearlHillImg },
          { title: "Japanese Cemetery Park", loc: "Hougang", cat: "Heritage", img: japaneseCemeteryImg },
          { title: "Hampstead Wetlands", loc: "Seletar Aerospace", cat: "Wildlife", img: hampsteadImg }
        ].map((gem, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <GemCard
              title={gem.title}
              location={gem.loc}
              category={gem.cat}
              image={gem.img}
            />
          </Grid>
        ))}
      </Grid>

    </Container>
  );
};

export default ContentSection;
