import { Grid, Avatar, Button, Card, CardHeader, CardContent, CardActions, CardMedia, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
//Placeholder images, waiting for database update
import itinerary1 from '../../assets/itinerary_guide_1.jpg';
import itinerary2 from '../../assets/itinerary_guide_2.jpg';

const Feeds = ({ screen, category }) => {
  return <>
    {screen == 'allFeeds' && category == 'localVideos' &&
      <Grid container spacing={3} sx={{marginTop: '1.5rem'}}>
        {/* Main template for Youtube videos */}
        <Card sx={{ width: '100%' }}>
          <CardHeader
            avatar={
              <Avatar aria-label="account-logo">
                J
              </Avatar>
            }
            title="James Goh"
            subheader="Social Media Influencer"
          />
          <CardMedia
            component="iframe"
            height="600"
            src="https://youtube.com/embed/tPcCpGDkyXg?autoplay=1"
            title="YouTube Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            allowFullScreen

          />

          <CardContent sx={{ paddingBottom: 0 }}>
            <IconButton aria-label="add to favorites" sx={{ paddingRight: '0.25rem', paddingLeft: 0 }}>
              <FavoriteIcon />
            </IconButton>
            139
            <p className="text-xl font-bold">Singapore Hidden Gems Explore Vibrant Streets & Iconic Spots!</p>
            <p className="text-l mt-2">The video highlights the following iconic spots:</p>
            <ul className="list-disc text-l pl-8">
              <li>Little India: Showcasing its vibrant and colorful streets.</li>
              <li>Sultan Mosque: A historic and architectural landmark.</li>
              <li>Haji Lane: Known for its artistic and trendy atmosphere.</li>
            </ul>
            <br />
            <p className='text-l'>Kampong Glam, Singapore</p>
            <p className='text-l'>Address: 3 Muscat St, Singapore 198833</p>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <p className='text-l'>14/01/2025</p>
            <Button variant="contained" sx={{ backgroundColor: '#6750A4' }}>Save Video</Button>
          </CardActions>

        </Card>

        {/* Main template for other videos (eg. Tiktok) */}
        <Card sx={{ width: '100%' }}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe">
                R
              </Avatar>
            }
            title="Shrimp and Chorizo Paella"
            subheader="September 14, 2016"
          />
          <CardMedia
            component="iframe"
            src="https://www.youtube.com/embed/-wwW3wLNFAY?start=580&autoplay=1"
            title="TikTok Video"
            height="700"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            scrolling="no"
          />

          <CardContent sx={{ paddingBottom: 0 }}>
            <div className="flex items-center">
              <IconButton aria-label="add to favorites" sx={{ paddingRight: '0.25rem', paddingLeft: 0 }}>
                <FavoriteIcon />
              </IconButton>
              139
            </div>

            <p className="text-xl font-bold">Singapore Hidden Gems Explore Vibrant Streets & Iconic Spots!</p>
            <p className="text-l mt-2">The video highlights Kampong Glam as its primary filming location, a historic neighborhood featuring the Sultan Mosque, the artistic Haji Lane, and the Hjh Maimunah Restaurant. Located a short distance from this area is the vibrant cultural district of Little India, which is celebrated for its colorful and lively streets. Finally, the video transitions to the modern waterfront of Marina Bay, home to the world-famous Gardens by the Bay and its iconic Supertrees.</p>
            <br />
            <p className='text-l'>Kampong Glam, Singapore</p>
            <p className='text-l'>Address: 3 Muscat St, Singapore 198833</p>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <p className='text-l'>14/01/2025</p>
            <Button variant="contained" sx={{ backgroundColor: '#6750A4' }}>Save Video</Button>
          </CardActions>
        </Card>
      </Grid>}
    {screen == 'allFeeds' && category == 'plannerGuides' &&
      <Grid container spacing={3} sx={{marginTop: '1.5rem'}}>
        {/* Main template for planner guides */}
        <Grid size={{ xs: 6 }}>
          <Card sx={{ width: '100%', padding: '1rem' }}>

            <CardMedia
              component="img"
              src={itinerary1}
              sx={{
                height: '400px',
                objectFit: 'contain',
                backgroundColor: '#E3E3E3'
              }}
            />

            <CardContent sx={{ padding: 0 }}>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xl font-bold">3 Day Itinerary Guide</p>
                <IconButton aria-label="add to favorites" sx={{ paddingRight: '0.25rem', paddingLeft: 0 }}>
                  <BookmarkBorderIcon sx={{ margin: 0, fontSize: '2rem' }} />
                </IconButton>
              </div>

              <p className='text-l my-1'>Spend your 3 days wisely by exploring hidden sights!</p>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 0, marginTop: '1rem' }}>
              <div className="flex items-center">
                <Avatar aria-label="account-logo">
                  J
                </Avatar>
                <p className='text-1 ml-3'>James Goh</p>
              </div>

              <p className='text-l'>14/01/2025</p>
            </CardActions>

          </Card>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Card sx={{ width: '100%', padding: '1rem' }}>

            <CardMedia
              component="img"
              src={itinerary2}
              sx={{
                height: '400px',
                objectFit: 'contain',
                backgroundColor: '#E3E3E3'
              }}
            />

            <CardContent sx={{ padding: 0 }}>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xl font-bold">3 Day Itinerary Guide</p>
                <IconButton aria-label="add to favorites" sx={{ paddingRight: '0.25rem', paddingLeft: 0 }}>
                  <BookmarkBorderIcon sx={{ margin: 0, fontSize: '2rem' }} />
                </IconButton>
              </div>

              <p className='text-l my-1'>Spend your 3 days wisely by exploring hidden sights!</p>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 0, marginTop: '1rem' }}>
              <div className="flex items-center">
                <Avatar aria-label="account-logo">
                  J
                </Avatar>
                <p className='text-1 ml-3'>James Goh</p>
              </div>

              <p className='text-l'>14/01/2025</p>
            </CardActions>

          </Card>
        </Grid>
      </Grid>
    }
  </>
}

export default Feeds;