import { useState, useEffect, useRef } from 'react';
import { Grid, Avatar, Stack, Box, CircularProgress, Button, Container, Paper, InputBase, IconButton, Checkbox, FormGroup, FormControlLabel, Typography } from '@mui/material';
import { ToggleFeedButton, ToggleCategoryButton } from '../components/feed/Buttons';
import { Search as SearchIcon } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { BACKEND_URL } from '../constants';

//Components & Templates
import LocalVideoTemplate from '../components/feed/LocalVideoTemplate';
import PlannerGuideTemplate from '../components/feed/PlannerGuideTemplate';
import SavedCardTemplate from '../components/feed/SavedCardTemplate';
import SnackBarDialog from '../components/layout/SnackBar';
import ManageVideoTemplate from '../components/feed/ManageVideoTemplate';
import ManageGuideTemplate from '../components/feed/ManageGuideTemplate';

const Feed = () => {
  const [localVideos, setLocalVideos] = useState([]);
  const [plannerGuides, setPlannerGuides] = useState([]);
  const [savedLocalVideos, setSavedLocalVideos] = useState([]);
  const [savedPlannerGuides, setSavedPlannerGuides] = useState([]);
  const [creatorMedia, setCreatorMedia] = useState([]);
  const [totalSaves, setTotalSaves] = useState(0);
  const [childData, setChildData] = useState(null);

  // For editing media
  const [selectedVideoID, setSelectedVideoID] = useState(null);
  const [selectedMediaID, setSelectedMediaID] = useState(null);
  const [localVideo, setLocalVideo] = useState({});
  const [plannerGuide, setPlannerGuide] = useState({});

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
    if (!userData) {
      snackRef.current.handleState('Login to save media.');
      setActiveScreen('savedFeeds');
      return;
    }
    const myHeaders = new Headers();
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

    fetch(`${BACKEND_URL}/api/save-unsave-media`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        snackRef.current.handleState(result.message);
        setActiveScreen('savedFeeds');
        window.scrollTo(0, 0);

      })
      .catch((error) => console.error(error));
  }

  // When the add button is clicked, reset and clear form
  const addFunction = () => {
    setSelectedVideoID(null);
    setSelectedMediaID(null);
    setLocalVideo({});
    setPlannerGuide({});
    setActiveScreen('manageFeeds');
  };

  const handleDataFromComponent = (data) => {
    setChildData(data);
    snackRef.current.handleState(data);
  }

  // This calculates the filtered list
  const getFilteredItems = (items) => {
    if (!items || !Array.isArray(items)) return [];
    let result = [...items];

    // Sort by likes
    if (isLikesChecked) {
      result.sort((a, b) => b.noOfLikes - a.noOfLikes);
    } else {
      result.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        // Added optional chaining ?. to prevent title errors
        item.title?.toLowerCase().includes(query)
      );
    }

    return result;
  };

  // Retieve filtered videos/guides based on above function
  const visibleVideos = getFilteredItems(savedLocalVideos);
  const visibleGuides = getFilteredItems(savedPlannerGuides);

  const fetchLocalVideos = async ({ pageParam = 1, queryKey }) => {
    const [_key, { isRecent, isLikes, search }] = queryKey;

    //Delayed to see loading sign
    await new Promise(resolve => setTimeout(resolve, 2000));
    const res = userData ? await fetch(`${BACKEND_URL}/api/local-videos/${userData.id}`) : await fetch(`${BACKEND_URL}/api/local-videos/null`);
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
      queryKey: ['videos', { isRecent: isRecentChecked, isLikes: isLikesChecked, search: searchQuery, savedVideos: savedLocalVideos }],
      queryFn: fetchLocalVideos,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        // If the last page returned data, increment
        // Otherwise, return undefined
        return lastPage.length > 0 ? allPages.length + 1 : undefined;
      },
    });

  //Retrieving saved planner guides / videos
  useEffect(() => {
    if (!userData || activeScreen !== 'savedFeeds') return;

    const fetchSavedData = async () => {
      try {
        const [videosRes, guidesRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/saved-videos/${userData.id}`),
          fetch(`${BACKEND_URL}/api/saved-guides/${userData.id}`)
        ]);

        const videos = await videosRes.json();
        const guides = await guidesRes.json();
        setSavedLocalVideos(videos);
        setSavedPlannerGuides(guides);
      } catch (error) {
        console.error("Failed to fetch saved items:", error);
      }
    };

    fetchSavedData();
  }, [activeScreen]);

  // Retrieve All Planner Guides
  useEffect(() => {
    const userId = userData?.id || 'null';
    const url = `${BACKEND_URL}/api/planner-guides/${userId}`;

    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPlannerGuides(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [childData]);

  // Retrieve Content Creator Analytics + Content Creator Media
  useEffect(() => {
    if (!userData || userData.role !== 'Content Creator') return;
    fetch(`${BACKEND_URL}/api/analytics/${userData.id}`)
      .then(res => res.json())
      .then(data => {
        const videoSaves = data["local-videos"].reduce((sum, item) => sum + (item.noOfSaves || 0), 0);
        const guideSaves = data["guides"].reduce((sum, item) => sum + (item.noOfSaves || 0), 0);
        const totalSaves = videoSaves + guideSaves;
        setCreatorMedia(data);
        setTotalSaves(totalSaves);
      });
  }, [childData]);

  // Retrieve local video based on clicking on "Edit" button
  useEffect(() => {
    if (!selectedVideoID) {
      setLocalVideo({});
      return;
    }

    fetch(`${BACKEND_URL}/api/local-video/${selectedVideoID}`)
      .then(res => res.json())
      .then(data => {
        setLocalVideo(data);
      })
      .catch(err => console.error("Error fetching video:", err.message));


  }, [activeScreen, selectedVideoID]);

  // Retrieve planner guide based on clicking on "Edit" button
  useEffect(() => {
    if (!selectedMediaID) {
      setPlannerGuide({});
      return;
    }
    fetch(`${BACKEND_URL}/api/planner-guide/${selectedMediaID}`)
      .then(res => res.json())
      .then(data => {
        setPlannerGuide(data);
      })
      .catch(err => console.error("Error fetching video:", err.message));
  }, [activeScreen, selectedMediaID])

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
          <Avatar src={userData ? userData.profilePicUrl : '/broken-image.jpg'} sx={{ bgcolor: '#b39ddb', border: '2px solid white' }}>
            {userData ? (userData.name?.charAt(0).toUpperCase() || 'C') : 'G'}
          </Avatar>
          <p className="text-l self-center">{userData ? userData.name : 'Guest'}</p>
        </Stack>

        <ToggleFeedButton id='allFeeds' label='All Feeds' onClick={() => setActiveScreen('allFeeds')} state={activeScreen}></ToggleFeedButton>
        <ToggleFeedButton id='savedFeeds' label='Saved' onClick={() => setActiveScreen('savedFeeds')} state={activeScreen}></ToggleFeedButton>
        {userData && userData.role == 'Content Creator' &&
          <ToggleFeedButton id='yourFeeds' label='Your Feeds' onClick={() => setActiveScreen('yourFeeds')} state={activeScreen}></ToggleFeedButton>
        }

        <Stack spacing={2} className='p-4 pb-4'>
          <p className="text-xl font-bold">Categories</p>

          <ToggleCategoryButton id='localVideos' label='Local Videos' qty={localVideos.length} onClick={() => setActiveCategory('localVideos')} state={activeCategory}></ToggleCategoryButton>
          <ToggleCategoryButton id='plannerGuides' label='Planner Guides' qty={plannerGuides.length} onClick={() => setActiveCategory('plannerGuides')} state={activeCategory}></ToggleCategoryButton>

        </Stack>

        <Stack spacing={2} className='p-4 pb-4'>
          {activeScreen !== 'yourFeeds' && activeScreen !== 'manageFeeds' && (
            <>
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
            </>
          )}

        </Stack>
      </Grid>


      <Grid size={9} sx={{ height: 'auto' }}>
        {/* Header & Search Bar */}
        <Container className='m-3! mx-0! px-0! flex justify-between items-center'>
          <div className='flex items-center'>
            {activeScreen == 'manageFeeds' && (
              <IconButton color="primary" className='mr-1!' aria-label="go back" onClick={() => setActiveScreen('yourFeeds')}>
                <ArrowBackIcon />
              </IconButton>
            )}

            <p className='text-3xl font-bold'>{{
              allFeeds: 'Feeds',
              savedFeeds: 'Saved Feeds',
              yourFeeds: 'Your Feeds',
              manageFeeds: 'Manage Feed'
            }[activeScreen]}</p>
          </div>
          <div className='flex justify-between w-max'>
            {activeScreen == 'savedFeeds' || activeScreen == 'allFeeds' ? (
              <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 5, boxShadow: 3 }}>
                <IconButton sx={{ p: '10px' }}><SearchIcon /></IconButton>
                <InputBase sx={{ ml: 1, flex: 1 }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." />
              </Paper>
            ) : activeScreen == 'yourFeeds' ? (
              <Button variant="contained" onClick={addFunction} className='m-0! mt-2!'>Add Media</Button>
            ) : (
              null
            )

            }

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
          !userData ? 'Please login to save videos.' : visibleVideos.length !== 0 ? visibleVideos.map((media) => <SavedCardTemplate savedMedia={media} key={media.savedMediaID} onUnsave={handleSave}></SavedCardTemplate>) : savedLocalVideos.message
        )}

        {/* Saved Planner Guides */}
        {activeScreen == 'savedFeeds' && activeCategory == 'plannerGuides' && (
          !userData ? 'Please login to save guides.' : visibleGuides.length !== 0 ? visibleGuides.map((media) => <SavedCardTemplate savedMedia={media} key={media.savedMediaID} onUnsave={handleSave}></SavedCardTemplate>) : savedPlannerGuides.message
        )}

        {/* Content Creator View (Analytics) */}
        {activeScreen == 'yourFeeds' && <>
          <Grid container spacing={5} sx={{ marginBottom: '2rem' }}>
            <Grid size={6}>
              <Typography align="center" className="bg-[#C21010] h-fit content-center rounded-2xl py-3 text-white">
                <p className="text-5xl">{creatorMedia.totalLikes}</p>
                <p className="text-xl uppercase">video likes</p>
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography align="center" className="bg-[#C21010] h-fit content-center rounded-2xl py-3 text-white">
                <p className="text-5xl">{totalSaves}</p>
                <p className="text-xl uppercase">saves</p>
              </Typography>

            </Grid>
          </Grid>
          {activeCategory == 'localVideos' && (
            Array.isArray(creatorMedia['local-videos']) ? creatorMedia['local-videos'].map((media) => <SavedCardTemplate savedMedia={media} key={media.postID} setScreen={setActiveScreen} setMessage={handleDataFromComponent} onSelect={(id) => setSelectedVideoID(id)}></SavedCardTemplate>) : 'No local videos, add a new local video now!'
          )}
          {activeCategory == 'plannerGuides' && (
            Array.isArray(creatorMedia['guides']) && creatorMedia['guides'].length != 0 ? creatorMedia['guides'].map((media) => <SavedCardTemplate savedMedia={media} key={media.guideID} setScreen={setActiveScreen} setMessage={handleDataFromComponent} onSelect={(id) => setSelectedMediaID(id)}></SavedCardTemplate>) : 'No planner guides, add a new planner guide now!'
          )}
        </>}

        {activeScreen == 'manageFeeds' && activeCategory == 'localVideos' && (
          <ManageVideoTemplate video={localVideo} setScreen={setActiveScreen} setMessage={handleDataFromComponent}></ManageVideoTemplate>
        )}
        {activeScreen == 'manageFeeds' && activeCategory == 'plannerGuides' && (
          <ManageGuideTemplate guide={plannerGuide} setScreen={setActiveScreen} setMessage={handleDataFromComponent}></ManageGuideTemplate>
        )}
      </Grid>
    </Grid>
    {/* Display snackbar */}
    <SnackBarDialog ref={snackRef}></SnackBarDialog>
  </>
}

export default Feed