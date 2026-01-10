import { Grid, Card, CardMedia, CardContent, IconButton, CardActions, Avatar, CardActionArea } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const PlannerGuideTemplate = ({ guide, onSave }) => {
  return (
    <Grid key={guide.guideID} size={{ xs: 12, sm: 6 }}>
      <Card sx={{ width: '100%', padding: '1rem' }}>
        <CardActionArea
          component="a"
          href={guide.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <CardMedia
            component="img"
            src={guide.imageUrl ? `/assets/${guide.imageUrl}` : null}
            sx={{
              height: '400px',
              objectFit: 'contain',
              backgroundColor: '#E3E3E3'
            }}
          />
        </CardActionArea>

        <CardContent sx={{ padding: 0 }}>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xl font-bold">{guide.title || "Itinerary Guide"}</p>
            <IconButton aria-label="add to favorites" onClick={() => onSave(guide)} sx={{ paddingRight: '0.25rem', paddingLeft: 0 }}>
              {guide.isSaved ? <BookmarkIcon sx={{ margin: 0, fontSize: '2rem' }} /> : <BookmarkBorderIcon sx={{ margin: 0, fontSize: '2rem' }} />}
            </IconButton>
          </div>

          <p className='text-l my-1'>{guide.description || "Explore hidden sights!"}</p>
        </CardContent>

        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 0, marginTop: '1rem' }}>
          <div className="flex items-center">
            <Avatar src={guide.user.profilePic && '/broken-image.jpg'}>
              {!guide.user.profilePic && (guide.user.userName.charAt(0).toUpperCase() || 'U')}
            </Avatar>
            <p className='text-1 ml-3'>{guide.user.userName || "User"}</p>
          </div>

          <p className='text-l'>{guide.datePosted.slice(0, 10) || "00/00/0000"}</p>
        </CardActions>

      </Card>
    </Grid>

  );
}

export default PlannerGuideTemplate; 