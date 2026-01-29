import { Alert, Box, Button, Collapse, MenuItem, Select, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../constants";

const defaultState = {
  mediaCode: '', title: '', location: '', address: '', description: '',
  likes: '', date: '', videoName: '', ownVideoUrl: '',
  externalVideoID: '', mediaType: 'tiktok'
};

const ManageVideoTemplate = ({ video = {}, setScreen, setMessage }) => {
  const [localVideo, setLocalVideo] = useState(defaultState);
  const [isEdit, setIsEdit] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem('user'));
  const MAX_SIZE_MB = 50; // Around max 1min video

  const [error, setError] = useState('');

  useEffect(() => {
    // If video is passed in
    if (video && Object.keys(video).length > 0) {
      setIsEdit(true);
      setLocalVideo({
        ...defaultState,
        mediaCode: video.mediaCode || '',
        title: video.title || '',
        location: video.location || '',
        address: video.address || '',
        description: video.description || '',
        likes: video.likes || '',
        date: video.date || '',
        externalVideoID: video.videoID || '',
        mediaType: video.mediaType || 'tiktok'
      });
    } else {
      setIsEdit(false);
      setLocalVideo(defaultState);
    }
  }, [video]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.includes('video')) {
      if (localVideo.ownVideoUrl) URL.revokeObjectURL(localVideo.ownVideoUrl);

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_SIZE_MB) {
        alert(`Video is too large! Maximum size is ${MAX_SIZE_MB} MB.`);
        return;
      }

      URL.createObjectURL(file);
      setLocalVideo(prev => ({ ...prev, videoName: file.name }));

      const reader = new FileReader();
      reader.onloadend = () => {
        const ownVideoUrl = reader.result;
        setLocalVideo(prev => ({ ...prev, ownVideoUrl }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Only videos (.mp4, .mov) are allowed!');
    }
  };

  const handleTypeChange = (e) => {
    setLocalVideo(prev => ({ ...prev, mediaType: e.target.value }))
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (localVideo.externalVideoID == "" && localVideo.ownVideoUrl == "") {
      setError("Please upload/insert a video");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/add/local-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: localVideo.title,
          description: localVideo.description,
          address: localVideo.location,
          fullAddress: localVideo.address,
          noOfLikes: localVideo.likes,
          ownVideoUrl: localVideo.ownVideoUrl,
          externalVideoID: localVideo.externalVideoID,
          datePosted: localVideo.date,
          mediaType: localVideo.mediaType,
          userID: userData.id
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message);
        setScreen('yourFeeds');
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.log("Upload error:", err);
      setError('Cannot upload to server. Please try again later');
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    setError('');

    if (localVideo.externalVideoID == "" && localVideo.ownVideoUrl == "") {
      if (!video.ownVideoUrl) {
        setError("Please upload/insert a video");
        console.log(error);
        return;
      }
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/edit/local-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postCode: localVideo.mediaCode,
          title: localVideo.title,
          description: localVideo.description,
          address: localVideo.location,
          fullAddress: localVideo.address,
          noOfLikes: localVideo.likes,
          ownVideoUrl: localVideo.ownVideoUrl || video.ownVideoUrl,
          externalVideoID: localVideo.externalVideoID,
          datePosted: localVideo.date,
          mediaType: localVideo.mediaType,
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message);
        setScreen('yourFeeds');
      }
    } catch (err) {
      console.log("Upload error:", err);
      setError('Cannot upload to server. Please try again later');
    }
  }

  const field = (fieldKey, title, label, value, setValue) => {
    return <div className={title == 'Video Title' ? 'mb-5' : 'mb-3'}>
      <p className="text-xl">{title}</p>
      {title == 'Description' && <p className="text-l">Please provide more information and any hidden secrets about your location</p>}
      <TextField
        label={label}
        type={title == 'Date' ? 'date' : 'text'}
        fullWidth
        multiline={title === 'Description'}
        rows={title === 'Description' ? 4 : 1}
        margin="dense"
        value={value}
        onChange={(e) => setValue(prev => ({ ...prev, [fieldKey]: e.target.value }))}
        slotProps={{
          inputLabel: {
            shrink: title === 'Date' ? true : undefined,
            required: title !== "Video ID",
          },
        }}
        required={title == "Video ID" ? false : true}
      />
    </div>

  }

  return <form onSubmit={isEdit ? handleEdit : handleSubmit}>
    {/* Error Message Section */}
    <Collapse in={Boolean(error)}>
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    </Collapse>

    {field('title', 'Video Title', 'Enter a appropriate title...', localVideo.title, setLocalVideo)}
    <div className="w-full h-auto">
      <input
        accept="video/*"
        type="file"
        id="video-upload"
        className="hidden"
        onChange={handleFileChange}
      />

      {!localVideo.ownVideoUrl && !video.ownVideoUrl ? (
        <div className="flex w-full h-auto gap-2">
          <div className="w-1/2 mr-5">
            <p className="text-2xl mb-2">Insert Video</p>
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="video-upload"
              className="border-red-400 border-dashed border-2 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl p-6 mt-2 rounded-md text-center block transition"
            >
              <AddIcon sx={{ height: '3rem', width: '3rem' }} /><br />
              Click to upload video
            </label>
          </div>

          <div className="w-1/2">
            <p className="text-2xl mb-2">Manual Insertion</p>
            {field('externalVideoID', 'Video ID', 'For youtube & tiktok links', localVideo.externalVideoID, setLocalVideo)}
            <p className="text-xl mb-3">Media Type</p>
            <Select
              value={localVideo.mediaType}
              label="Age"
              fullWidth
              onChange={handleTypeChange}
            >
              <MenuItem value={'tiktok'}>TikTok</MenuItem>
              <MenuItem value={'youtube'}>Youtube</MenuItem>
            </Select>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-2xl mb-2">Added video: {localVideo.videoName}</p>
          <video
            src={localVideo.ownVideoUrl || video.ownVideoUrl}
            controls
            className="block mx-auto"
          />
          <input
            type="file"
            id="video-upload-again"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex justify-center w-full">
            <label
              htmlFor="video-upload-again"
              className="mt-4 mb-4 cursor-pointer bg-[#196f75] hover:bg-[#145a5f] text-white text-lg p-2 rounded-md transition"
            >
              Reupload Video
            </label>
          </div>
        </div>
      )}
    </div>
    {field('likes', 'Likes', 'Number of likes...', localVideo.likes, setLocalVideo)}
    {field('date', 'Date', 'Date Posted...', localVideo.date, setLocalVideo)}
    {field('location', 'Location Name', 'Enter full name...', localVideo.location, setLocalVideo)}
    {field('address', 'Address', 'Enter full address...', localVideo.address, setLocalVideo)}
    {field('description', 'Description', 'Enter your video description...', localVideo.description, setLocalVideo)}

    <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
      <Button
        type="submit"
        size="large"
        sx={{ width: 120, color: "white", backgroundColor: '#196f75', borderRadius: 3, '&:hover': { backgroundColor: '#145a5f' } }}
      >
        {isEdit ? 'Edit' : 'Publish'}
      </Button>
    </Box>
  </form >
}

export default ManageVideoTemplate;