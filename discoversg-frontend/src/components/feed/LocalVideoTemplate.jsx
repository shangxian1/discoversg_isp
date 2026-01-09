import { Grid, Avatar, Button, Card, CardHeader, CardContent, CardActions, CardMedia, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const LocalVideoTemplate = ({ localVideo }) => {
  const handleClick = async () => {
    const myHeaders = new Headers();
      const userData = JSON.parse(localStorage.getItem('user'));
    myHeaders.append("Content-Type", "application/json");

    const raw = {
      "userID": userData.id,
      "postID": localVideo.postID,
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow"
    };

    fetch("http://localhost:3000/api/save-unsave-media", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  return <>
    <Grid container spacing={3} sx={{ marginTop: '1.5rem' }}>
      {/* Main template for Youtube videos */}
      <Card sx={{ width: '100%' }}>
        <CardHeader
          avatar={
            <Avatar src={localVideo.user.profilePic && '/broken-image.jpg'} aria-label="account-logo">
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
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
          allowFullScreen
        />

        <CardContent sx={{ paddingBottom: 0 }}>
          <IconButton aria-label="add to favorites" sx={{ paddingRight: '0.25rem', paddingLeft: 0 }}>
            <FavoriteIcon color='error' />
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
          <Button variant="contained" onClick={handleClick} sx={{ backgroundColor: '#6750A4' }}>Save Video</Button>
        </CardActions>

      </Card>
    </Grid>
  </>
}

export default LocalVideoTemplate;