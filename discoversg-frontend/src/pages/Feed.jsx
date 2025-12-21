import React, { useState } from 'react';
import { Grid, Avatar, Stack, Button, Box } from '@mui/material';
import { ToggleFeedButton, ToggleCategoryButton } from '../components/feed/Buttons';

function Feed() {
  const [activeScreen, setActiveScreen] = useState('allFeeds');
  const [activeCategory, setActiveCategory] = useState('localVideos');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'allFeeds':
        return <p>All Feeds Section</p>
      //return <Feeds />;
      case 'savedFeeds':
        return <p>Saved Feeds Section</p>
      //return <SavedFeeds />;
      default:
        return null;
    };
  }

  const renderCategory = () => {
    switch (activeCategory) {
      case 'localVideos':
        return <p>Local Videos Section</p>
      //return <Feeds />;
      case 'plannerGuides':
        return <p>Planner Guides Section</p>
      //return <Feeds />;
      default:
        return null;
    };
  }

  return <>
    <Grid container spacing={5} className="m-5">
      <Grid size={3} rowSpacing={10} sx={{ backgroundColor: '#ECECEE', borderRadius: '0.5rem', position: 'sticky', top: '5%', height: '100%'}}>
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

      <Grid size={9} sx={{height: '1000px'}}>
        {renderScreen()}
        {renderCategory()}
      </Grid>
    </Grid>
  </>
}

export default Feed