import React, { useState, useEffect } from 'react';
import { Grid, Avatar, Stack, Button, Card, CardHeader, CardContent, CardActions, CardMedia, Container, Paper, InputBase, IconButton, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import { ToggleFeedButton, ToggleCategoryButton } from '../components/feed/Buttons';
import { Search as SearchIcon } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import Feeds from '../components/feed/LocalVideoTemplate';
import LocalVideoTemplate from '../components/feed/LocalVideoTemplate';
import PlannerGuideTemplate from '../components/feed/PlannerGuideTemplate';

function Feed() {
  const [localVideos, setLocalVideos] = useState([]);
  const [plannerGuides, setPlannerGuides] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/local-videos')
      .then(res => res.json())
      .then(data => {
        setLocalVideos(data);
      });

    fetch('http://localhost:3000/api/planner-guides')
      .then(res => res.json())
      .then(data => {
        setPlannerGuides(data);
      });
    console.log(plannerGuides);
  }, []);

  const [activeScreen, setActiveScreen] = useState('allFeeds');
  const [activeCategory, setActiveCategory] = useState('localVideos');
  const [isRecentChecked, setRecentChecked] = useState(false);
  const [isLikesChecked, setLikesChecked] = useState(false);

  const handleRecentChange = (event) => {
    setRecentChecked(event.target.checked);
  }

  const handleLikesChange = (event) => {
    setLikesChecked(event.target.checked);
  }

  return <>
    <Grid container spacing={5} className="m-5">
      <Grid size={3} rowSpacing={10} sx={{ backgroundColor: '#ECECEE', borderRadius: '0.5rem', position: 'sticky', top: '5%', height: '100%' }}>
        <Stack direction="row" spacing={2} className='p-4 pb-4'>
          <Avatar src={userData.profilePicUrl && '/broken-image.jpg'} sx={{ bgcolor: '#b39ddb', border: '2px solid white' }}>
            {!userData.profilePicUrl && (userData.name?.charAt(0).toUpperCase() || 'U')}
          </Avatar>
          <p className="text-l self-center">{userData.name}</p>
        </Stack>

        <ToggleFeedButton id='allFeeds' label='All Feeds' onClick={() => setActiveScreen('allFeeds')} state={activeScreen}></ToggleFeedButton>
        <ToggleFeedButton id='savedFeeds' label='Saved' onClick={() => setActiveScreen('savedFeeds')} state={activeScreen}></ToggleFeedButton>
        {userData.role == 'Content Creator' &&
          <ToggleFeedButton id='yourFeeds' label='Your Feeds' onClick={() => setActiveScreen('yourFeeds')} state={activeScreen}></ToggleFeedButton>
        }

        <Stack spacing={2} className='p-4 pb-4'>
          <p className="text-xl font-bold">Categories</p>

          <ToggleCategoryButton id='localVideos' label='Local Videos' qty={localVideos.length} onClick={() => setActiveCategory('localVideos')} state={activeCategory}></ToggleCategoryButton>
          <ToggleCategoryButton id='plannerGuides' label='Planner Guides' qty={plannerGuides.length} onClick={() => setActiveCategory('plannerGuides')} state={activeCategory}></ToggleCategoryButton>

        </Stack>

        <Stack spacing={2} className='p-4 pb-4'>
          <p className="text-xl font-bold">Filter</p>
          <FormGroup>
            <FormControlLabel className='w-fit rounded-xs pr-3' control={
              <Checkbox
                checked={isRecentChecked}
                onChange={handleRecentChange}
              />
            } label="Recent Feeds" />
            {activeCategory == 'localVideos' &&
              <FormControlLabel className='w-fit rounded-xs pr-3' control={
                <Checkbox
                  checked={isLikesChecked}
                  onChange={handleLikesChange}
                />
              } label="Top Rated" />
            }

          </FormGroup>
        </Stack>
      </Grid>

      <Grid size={9} sx={{ height: '100%' }}>
        <Container className='m-3! mx-0! px-0! flex justify-between items-center'>
          <p className='text-3xl font-bold'>Feed</p>
          <div className='flex justify-between w-max'>
            <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 5, boxShadow: 3 }}>
              <IconButton sx={{ p: '10px' }}><SearchIcon /></IconButton>
              <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search..." />
              <Button variant="contained" color="secondary" sx={{ borderRadius: 5, px: 4 }}>Search</Button>
            </Paper>
          </div>
        </Container>
        {activeScreen == 'allFeeds' && activeCategory == 'localVideos' &&
          localVideos.map((localVideo) => <LocalVideoTemplate localVideo={localVideo} key={localVideo.postID}></LocalVideoTemplate>)
        }
        <Grid container spacing={3} sx={{ marginTop: '1.5rem' }}>
          {activeScreen == 'allFeeds' && activeCategory == 'plannerGuides' &&
            plannerGuides.map((plannerGuide) => <PlannerGuideTemplate guide={plannerGuide} key={plannerGuide.guideID}></PlannerGuideTemplate>)
          }
        </Grid>

      </Grid>
    </Grid>
  </>
}

export default Feed