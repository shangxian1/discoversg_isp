import { Grid, Button, Card, CardMedia, CardContent, IconButton, CardActions, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const SavedCardTemplate = ({ savedMedia, onUnsave }) => {
  const isYoutube = savedMedia.mediaUrl.includes('https://www.youtube.com');
  const isTiktok = savedMedia.mediaUrl.includes('https://www.tiktok.com');
  const regex = /embed\/([a-zA-Z0-9_-]{11})/;
  const match = savedMedia.mediaUrl.match(regex);
  console.log(savedMedia.imageUrl);
  return (
    <>
      <Card sx={{ marginBottom: '1rem' }}>
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size={3}>
            <CardMedia
              component="img"
              // Placeholder image in case image not found / doesn't work
              src={isYoutube && match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : isTiktok ? `/assets/tiktok_thumbnail.jpg` : `/assets/${savedMedia.imageUrl}`}
              title="YouTube Video Player"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
              allowFullScreen
              sx={{
                width: '100%',
                borderRadius: '0.5rem'
              }}
              className='m-3 mr-0'
            />
          </Grid>
          <Grid size={6}>
            <CardContent>
              <p className="text-xl font-bold">{savedMedia.title}</p>
              <div className="flex items-center">
                {isYoutube || isTiktok &&
                  <>
                    <IconButton aria-label="add to favorites" sx={{ paddingRight: '0.25rem', paddingLeft: 0 }}>
                      <FavoriteIcon color='error' />
                    </IconButton>
                    {savedMedia.noOfLikes}
                  </>
                }

                <Avatar src={savedMedia.user.profilePic && '/broken-image.jpg'} sx={{ bgcolor: '#b39ddb', border: '2px solid white', height: '32px', width: '32px', marginLeft: isYoutube || isTiktok ? '1rem' : 0 }}>
                  {!savedMedia.user.profilePic && (savedMedia.user.userName?.charAt(0).toUpperCase() || 'U')}
                </Avatar>
                <p className="text-l ml-2">{savedMedia.user.userName}</p>


              </div>
            </CardContent>
          </Grid>
          <Grid size="grow">
            <CardActions sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
              <Button variant="contained" sx={{ backgroundColor: '#6750A4' }}>{isYoutube || isTiktok ? 'View Activity' : 'Find out more'}</Button>
              <Button variant="contained" onClick={() => onUnsave(savedMedia)} className='m-0! mt-2!'>Unsave Feed</Button>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default SavedCardTemplate; 