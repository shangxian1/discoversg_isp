import { Grid, Avatar, Button, Card, CardHeader, CardContent, CardActions, CardMedia, IconButton, Typography} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Feeds = ({category}) => {
  return <>
    {category == 'localVideos' ? <Grid container spacing={5}>
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
          src="https://youtube.com/embed/tPcCpGDkyXg"
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
          src="https://www.tiktok.com/embed/7072819797184171310"
          title="TikTok Video"
          height="700"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
          scrolling="no"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Embedded TikTok
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This content is hosted within an MUI CardMedia component using an iframe.
          </Typography>
        </CardContent>
      </Card>
    </Grid> : 
    <Grid>
      
    </Grid>}
  </>
}

export default Feeds;