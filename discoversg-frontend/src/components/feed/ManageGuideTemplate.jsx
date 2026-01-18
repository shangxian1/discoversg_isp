import { Alert, Box, Button, Collapse, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

//NOT COMPLETE
const ManageGuideTemplate = ({ guide = {} }) => {
  const navigate = useNavigate();
  const [travelGuide, setTravelGuide] = useState({
    title: guide.title || '',
    description: guide.description || '',
    date: guide.date || '',
    imageUrl : guide.imageUrl || ''
  })

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(localVideo);
  }

  const field = (fieldKey, title, label, value, setValue) => {
    return <div className={title == 'Video Title' ? 'mb-5' : 'mb-3'}>
      <p className="text-xl">{title}</p>
      {title == 'Description' && <p className="text-l">Please provide more information and any hidden secrets about your location</p>}
      <TextField
        label={label}
        fullWidth
        multiline={title === 'Description'}
        rows={title === 'Description' ? 4 : 1}
        margin="dense"
        value={value}
        onChange={(e) => setValue(prev => ({ ...prev, [fieldKey]: e.target.value }))}
        slotProps={{
          inputLabel: {
            required: false,
          },
        }}
        required={title == "Video ID" ? false : true}
      />
    </div>

  }

  return <form onSubmit={handleSubmit}>
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

      {!localVideo.ownVideoUrl ? (
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
            {field('externalVideoUrl', 'Video ID', 'For youtube & tiktok links', localVideo.externalVideoUrl, setLocalVideo)}
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
            src={localVideo.ownVideoUrl}
            controls
            className="w-fit!"
          />
          <label
            htmlFor="video-upload"
            className="mt-4 cursor-pointer bg-[#196f75] hover:bg-[#145a5f] text-white text-lg p-2 rounded-md inline-block transition"
          >
            Replace Video
          </label>
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
        Publish
      </Button>
    </Box>
  </form >
}

export default ManageGuideTemplate;