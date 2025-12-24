import React, { useState } from 'react';
import { Grid, Avatar, Stack, Button, Box, Container, Paper, InputBase, IconButton } from '@mui/material';
import { ToggleFeedButton, ToggleCategoryButton } from '../components/feed/Buttons';
import { Search as SearchIcon } from '@mui/icons-material';

import Feeds from '../components/feed/Feeds';

function Feed() {
  const [activeScreen, setActiveScreen] = useState('allFeeds');
  const [activeCategory, setActiveCategory] = useState('localVideos');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'allFeeds':
        return <Feeds category={activeCategory} />;
      case 'savedFeeds':
        return <p>Saved Feeds Section</p>
      //return <SavedFeeds />;
      default:
        return null;
    };
  }

  const renderCategory = () => {
    switch (activeCategory) {
      case 'localVideos' && activeScreen !== 'localVideos':
        return <Feeds category={activeCategory} />;
      case 'plannerGuides':
        return <Feeds category={activeCategory} />;
      default:
        return null;
    };
  }

  return <>
    <Grid container spacing={5} className="m-5">
      <Grid size={3} rowSpacing={10} sx={{ backgroundColor: '#ECECEE', borderRadius: '0.5rem', position: 'sticky', top: '5%', height: '100%' }}>
        <Stack direction="row" spacing={2} className='p-4 pb-4'>
          <Avatar src="/broken-image.jpg" />
          <p className="text-l self-center">Anoynomous</p>
        </Stack>

        <ToggleFeedButton id='allFeeds' label='All Feeds' onClick={() => setActiveScreen('allFeeds')} state={activeScreen}></ToggleFeedButton>
        <ToggleFeedButton id='savedFeeds' label='Saved' onClick={() => setActiveScreen('savedFeeds')} state={activeScreen}></ToggleFeedButton>

        <Stack spacing={2} className='p-4 pb-4'>
          <p className="text-xl font-bold">Categories</p>

          <ToggleCategoryButton id='localVideos' label='Local Videos' qty='3' onClick={() => setActiveCategory('localVideos')} state={activeCategory}></ToggleCategoryButton>
          <ToggleCategoryButton id='plannerGuides' label='Planner Guides' qty='3' onClick={() => setActiveCategory('plannerGuides')} state={activeCategory}></ToggleCategoryButton>

        </Stack>

        <Stack spacing={2} className='p-4 pb-4'>
          <p className="text-xl font-bold">Filter</p>
          <Button
            variant='contained'
            className='bg-white! text-black! normal-case!'
          //onClick={}
          >
            <Box display="flex" gap={1}>
              <p>Recent Feeds</p>
            </Box>
          </Button>
          <Button
            variant='contained'
            className='bg-white! text-black! normal-case!'
          //onClick={}
          >
            <Box display="flex" gap={1}>
              <p>Most Likes</p>
            </Box>
          </Button>
        </Stack>
      </Grid>

      <Grid size={9} sx={{ height: '100%' }}>
        <Container className='m-3! mx-0! px-0! flex justify-between'>
          <p className='text-3xl font-bold'>Feed</p>
          <div className='flex justify-between w-max align-middle'>
            <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 5, boxShadow: 3 }}>
              <IconButton sx={{ p: '10px' }}><SearchIcon /></IconButton>
              <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." />
              <Button variant="contained" color="secondary" sx={{ borderRadius: 5, px: 4 }}>Search</Button>
            </Paper>
          </div>
        </Container>
        {renderScreen()}
        {renderCategory()}
      </Grid>
    </Grid>
  </>
}

export default Feed