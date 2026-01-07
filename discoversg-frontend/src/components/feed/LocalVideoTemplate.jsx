import { Grid, Avatar, Button, Card, CardHeader, CardContent, CardActions, CardMedia, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const LocalVideoTemplate = ({localVideo}) => {
  return <>
    <Grid container spacing={3} sx={{ marginTop: '1.5rem' }}>
      {/* Main template for Youtube videos */}
      <Card sx={{ width: '100%' }}>
        <CardHeader
          avatar={
            <Avatar src={localVideo.user.profilePicUrl && '/broken-image.jpg'} aria-label="account-logo">
            </Avatar>
          }
          title={localVideo.user.userName}
          subheader={localVideo.user.role}
        />
        <CardMedia
          component="iframe"
          height="700"
          src={localVideo.mediaUrl}
          title="YouTube Video Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
          allowFullScreen
        />

        <CardContent sx={{ paddingBottom: 0 }}>
          <IconButton aria-label="add to favorites" sx={{ paddingRight: '0.25rem', paddingLeft: 0 }}>
            <FavoriteIcon color='error'/>
          </IconButton>
          {localVideo.noOfLikes}
          <p className="text-xl font-bold">{localVideo.title}</p>
          <p className="text-l mt-2">{localVideo.description}</p>
          <br />
          <p className='text-l'>{localVideo.addressName}</p>
          <p className='text-l'>Address: {localVideo.fullAddress}</p>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p className='text-l'>{localVideo.datePosted.slice(0, 10)}</p>
          <Button variant="contained" sx={{ backgroundColor: '#6750A4' }}>Save Video</Button>
        </CardActions>

      </Card>
    </Grid>
  </>
}

export default LocalVideoTemplate;