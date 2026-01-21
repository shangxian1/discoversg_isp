import { Grid, Button, Card, CardMedia, CardContent, IconButton, CardActions, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Collapse, Alert } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import SnackBarDialog from '../layout/SnackBar';
import { useRef } from 'react';
import { BACKEND_URL } from '../../constants';

const SavedCardTemplate = ({ savedMedia, onUnsave, setScreen, onSelect }) => {
  const isYoutube = savedMedia.mediaUrl.includes('https://www.youtube.com');
  const isTiktok = savedMedia.mediaUrl.includes('https://www.tiktok.com');
  const regex = /embed\/([a-zA-Z0-9_-]{11})/;
  const match = savedMedia.mediaUrl.match(regex);
  const [open, setOpen] = useState(false);
  const snackRef = useRef();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const editFunction = () => {
    setScreen('manageFeeds');
    onSelect(savedMedia.savedMediaCode);
  }

  const handleDelete = async (e) => {
    e.preventDefault();

    const response = await fetch(`${BACKEND_URL}/api/delete/local-video/${savedMedia.savedMediaCode}`, {
      method: 'DELETE',
    });
    const data = await response.json();

    if (response.ok) {
      handleClose();
      snackRef.current.handleState(data.message);
    }
    try {

    } catch (e) {
      console.log("Upload error:", err);
      snackRef.current.handleState("Unable to delete, something went wrong");
    }
  }
  return (
    <>
      <Card className='mt-5'>
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size={3}>
            <CardMedia
              component="img"
              // Placeholder image in case image not found / doesn't work
              src={isYoutube && match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : isTiktok ? `/assets/tiktok_thumbnail.jpg` : `/assets/${savedMedia.imageUrl}`}
              title={savedMedia.title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
              allowFullScreen
              className='m-3 mr-0 rounded-xl w-fit'
            />
          </Grid>
          <Grid size={6}>
            <CardContent>
              <p className="text-xl font-bold">{savedMedia.title}</p>
              <div className="flex items-center">
                {(isYoutube || isTiktok) && (
                  <div className='my-2'>
                    <FavoriteIcon color="error" />
                    <span>{savedMedia.noOfLikes}</span>
                    {Object.hasOwn(savedMedia, 'noOfSaves') && (
                      <>
                        <BookmarkIcon className='ml-2'></BookmarkIcon>
                        <span>{savedMedia.noOfSaves}</span>
                      </>
                    )}

                  </div>
                )}

                {savedMedia.user && (
                  <>
                    <Avatar
                      src={savedMedia.user.profilePic ? savedMedia.user.profilePic : '/broken-image.jpg'}
                      sx={{
                        bgcolor: '#b39ddb',
                        border: '2px solid white',
                        height: '32px',
                        width: '32px',
                        marginLeft: isYoutube || isTiktok ? '1rem' : 0,
                      }}
                    >
                      {!savedMedia.user.profilePic &&
                        (savedMedia.user.userName?.charAt(0).toUpperCase() || 'U')}
                    </Avatar>
                    <p className="text-l ml-2">{savedMedia.user.userName}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Grid>
          <Grid size="grow">
            <CardActions sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
              {Object.hasOwn(savedMedia, 'noOfSaves') ? (
                <>
                  <Button variant="contained" startIcon={<EditIcon />} onClick={editFunction} sx={{ backgroundColor: '#6750A4' }}>Edit</Button>
                  <Button variant="contained" startIcon={<DeleteOutlineIcon />} onClick={handleClickOpen} className='m-0! mt-2!'>Delete</Button>
                </>
              ) : (
                <>
                  <Button variant="contained" sx={{ backgroundColor: '#6750A4' }}>{isYoutube || isTiktok ? 'View Activity' : 'Find out more'}</Button>
                  <Button variant="contained" onClick={() => onUnsave(savedMedia)} className='m-0! mt-2!'>Unsave Feed</Button>
                </>
              )}
            </CardActions>
          </Grid>
        </Grid>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Media"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this media? Content will all be deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
      <SnackBarDialog ref={snackRef}></SnackBarDialog>
    </>
  );
}

export default SavedCardTemplate; 