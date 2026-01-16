import React, { useState, useEffect, useRef } from 'react';
import { Grid, Avatar, Stack, Box, CircularProgress, Button, Card, CardHeader, CardContent, CardActions, CardMedia, Container, Paper, InputBase, IconButton, Checkbox, FormGroup, FormControlLabel, Snackbar, Fade } from '@mui/material';
import { ToggleFeedButton, ToggleCategoryButton } from '../components/feed/Buttons';
import { Search as SearchIcon } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

import LocalVideoTemplate from '../components/feed/LocalVideoTemplate';
import PlannerGuideTemplate from '../components/feed/PlannerGuideTemplate';
import SavedCardTemplate from '../components/feed/SavedCardTemplate';
import SnackBarDialog from '../components/layout/SnackBar';

const Feed = () => {
  const [localVideos, setLocalVideos] = useState([]);
  const [plannerGuides, setPlannerGuides] = useState([]);
  const [savedLocalVideos, setSavedLocalVideos] = useState([]);
  const [savedPlannerGuides, setSavedPlannerGuides] = useState([]);
  const userData = JSON.parse(sessionStorage.getItem('user'));
  const { ref, inView } = useInView();
  const snackRef = useRef();

  const [activeScreen, setActiveScreen] = useState('allFeeds');
  const [activeCategory, setActiveCategory] = useState('localVideos');
  const [isRecentChecked, setRecentChecked] = useState(true);
  const [isLikesChecked, setLikesChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRecentChange = (event) => setRecentChecked(event.target.checked);
  const handleLikesChange = (event) => setLikesChecked(event.target.checked);

  const handleSave = async (videoData) => {
    const myHeaders = new Headers();
    const userData = JSON.parse(localStorage.getItem('user'));
    myHeaders.append("Content-Type", "application/json");
    console.log(videoData);
    const raw = {
      "userID": userData.id,
      "mediaID": videoData.savedMediaCode,
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow"
    };

    fetch("http://localhost:3000/api/save-unsave-media", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        snackRef.current.handleState(result.message);
        setActiveScreen('savedFeeds');
        window.scrollTo(0, 0);
        
      })
      .catch((error) => console.error(error));
  }

  const fetchLocalVideos = async ({ pageParam = 1, queryKey }) => {
    const [_key, { isRecent, isLikes, search }] = queryKey;

    //Delayed to see loading sign
    await new Promise(resolve => setTimeout(resolve, 2000));
    const res = await fetch('http://localhost:3000/api/local-videos');
    const data = await res.json();
    let filteredData = [...data];
    setLocalVideos(data);

    //Sorting logic
    if (isRecent) {
      filteredData.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    } else if (isLikes) {
      filteredData.sort((a, b) => b.noOfLikes - a.noOfLikes);
    }

    //Search logic
    if (search && search.trim().length > 0) {
      filteredData = filteredData.filter(video =>
        video.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Slice the data (Displays 2 posts for each call)
    return filteredData.slice((pageParam - 1) * 2, pageParam * 2);
  };

  //Prevent client overload: using "useInfiniteQuery" to display two posts at a time
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      //Refresh when variables below changed
      queryKey: ['videos', { isRecent: isRecentChecked, isLikes: isLikesChecked, search: searchQuery, localVideos }],
      queryFn: fetchLocalVideos,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        // If the last page returned data, increment
        // Otherwise, return undefined
        return lastPage.length > 0 ? allPages.length + 1 : undefined;
      },
    });

  useEffect(() => {
    fetch('http://localhost:3000/api/planner-guides')
      .then(res => res.json())
      .then(data => {
        setPlannerGuides(data);
      });
    fetch('http://localhost:3000/api/saved-videos')
      .then(res => res.json())
      .then(data => {
        isLikesChecked && data.sort((a, b) => b.noOfLikes - a.noOfLikes);
        if (searchQuery && searchQuery.trim().length > 0) {
          data = data.filter(video =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setSavedLocalVideos(data);
      });
    fetch('http://localhost:3000/api/saved-guides')
      .then(res => res.json())
      .then(data => {
        isLikesChecked && data.sort((a, b) => b.noOfLikes - a.noOfLikes);
        if (searchQuery && searchQuery.trim().length > 0) {
          data = data.filter(video =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setSavedPlannerGuides(data);
      });
  }, [savedLocalVideos, isLikesChecked, searchQuery]);

  //Detection when the viewport has reached to the end of the page
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);


  return <>
    <Grid container spacing={5} className="m-5">

      {/* Control Panel */}
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
        {/* Header & Search Bar */}
        <Container className='m-3! mx-0! px-0! flex justify-between items-center'>
          <p className='text-3xl font-bold'>{activeScreen == 'allFeeds' ? 'Feeds' : 'Saved Feeds'}</p>
          <div className='flex justify-between w-max'>
            <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 5, boxShadow: 3 }}>
              <IconButton sx={{ p: '10px' }}><SearchIcon /></IconButton>
              <InputBase sx={{ ml: 1, flex: 1 }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." />
            </Paper>
          </div>
        </Container>

        {/* Local Videos */}
        {activeScreen == 'allFeeds' && activeCategory == 'localVideos' && (
          <>
            {data?.pages.map((page, index) => (
              <div key={index}>
                {page.map((localVideo) => (
                  <LocalVideoTemplate key={localVideo.postID} localVideo={localVideo} onSave={handleSave} />
                ))}
              </div>
            ))}
            {hasNextPage && (
              <div ref={ref}>
                {isFetchingNextPage ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <CircularProgress />
                    <p className="text-xl ml-2 self-center font-bold">Loading more videos...</p>
                  </Box>
                ) : (
                  <p>Nothing more to load</p>
                )}
              </div>
            )}
            {status == 'pending' && (
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: '2rem' }}>
                <CircularProgress className='self-center' />
                <p className="text-xl mt-5 self-center font-bold">Loading Feed...</p>
              </Box>
            )
            }
          </>
        )}

        {/* Planner Guides */}
        <Grid container spacing={3} sx={{ marginTop: '1.5rem' }}>
          {activeScreen == 'allFeeds' && activeCategory == 'plannerGuides' &&
            plannerGuides.map((plannerGuide) => <PlannerGuideTemplate guide={plannerGuide} key={plannerGuide.guideID} onSave={handleSave}></PlannerGuideTemplate>)
          }
        </Grid>

        {/* Saved Local Videos */}
        {activeScreen == 'savedFeeds' && activeCategory == 'localVideos' && (
          Array.isArray(savedLocalVideos) ? savedLocalVideos.map((media) => <SavedCardTemplate savedMedia={media} key={media.savedMediaID} onUnsave={handleSave}></SavedCardTemplate>) : savedLocalVideos.message
        )}
        
        {/* Saved Planner Guides */}
        {activeScreen == 'savedFeeds' && activeCategory == 'plannerGuides' && (
          Array.isArray(savedPlannerGuides) ? savedPlannerGuides.map((media) => <SavedCardTemplate savedMedia={media} key={media.savedMediaID} onUnsave={handleSave}></SavedCardTemplate>) : savedPlannerGuides.message
        )}
      </Grid>
    </Grid>
    {/* Display snackbar when save/unsave video */}
    <SnackBarDialog ref={snackRef}></SnackBarDialog>
  </>
}

export default Feed