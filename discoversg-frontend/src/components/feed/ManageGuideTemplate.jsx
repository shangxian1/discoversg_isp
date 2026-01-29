import { Alert, Box, Button, Collapse, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { BACKEND_URL } from "../../constants";

const defaultState = {
  mediaCode: '', title: '', description: '', date: '', imageUrl: '', mediaUrl: ''
};

const ManageGuideTemplate = ({ guide = {}, setScreen, setMessage }) => {
  const [travelGuide, setTravelGuide] = useState({ defaultState });
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem('user'));
  const MAX_SIZE_MB = 10; // Set image limit size

  useEffect(() => {
    // If guide is passed in
    if (guide && Object.keys(guide).length > 0) {
      setIsEdit(true);
      setTravelGuide({
        ...defaultState,
        mediaCode: guide.mediaCode || '',
        title: guide.title || '',
        description: guide.description || '',
        date: guide.date || '',
        imageUrl: guide.imageUrl || '',
        mediaUrl: guide.mediaUrl || ''
      });
    } else {
      setIsEdit(false);
      setTravelGuide(defaultState);
    }
  }, [guide]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('image')) {
      if (travelGuide.imageUrl) URL.revokeObjectURL(travelGuide.imageUrl);

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_SIZE_MB) {
        alert(`Picture is too large! Maximum size is ${MAX_SIZE_MB} MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result; // This is the base64 string
        setTravelGuide(prev => ({
          ...prev,
          imageName: file.name, // Update key name
          imageUrl: imageUrl    // Update key name
        }));
      };
      reader.readAsDataURL(file);
      console.log(travelGuide);
    } else {
      alert('Only images (.jpg, .png, etc) are allowed!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (travelGuide.imageUrl == "") {
      setError("Please upload an image");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/add/travel-guide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: travelGuide.title,
          description: travelGuide.description,
          imageUrl: travelGuide.imageUrl,
          mediaUrl: travelGuide.mediaUrl,
          datePosted: travelGuide.date,
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

    if (travelGuide.imageUrl == "") {
      setError("Please upload an image");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/edit/travel-guide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideCode: travelGuide.mediaCode,
          title: travelGuide.title,
          description: travelGuide.description,
          imageUrl: travelGuide.imageUrl,
          mediaUrl: travelGuide.mediaUrl,
          datePosted: travelGuide.date,
          userID: userData.id
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
    return <div className={title == 'Guide Title' ? 'mb-5' : 'mb-3'}>
      <p className="text-xl">{title}</p>
      {title == 'Description' && <p className="text-l">Please provide more information about your travel guide.</p>}
      <TextField
        label={label}
        type={title == 'Date' ? 'date' : 'text'}
        fullWidth
        multiline={title === 'Description'}
        rows={title === 'Description' ? 4 : 1}
        margin="dense"
        value={value ?? ""}
        onChange={(e) => setValue(prev => ({ ...prev, [fieldKey]: e.target.value }))}
        slotProps={{
          inputLabel: {
            shrink: title === 'Date' ? true : undefined,
            required: false,
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

    {field('title', 'Guide Title', 'Enter a appropriate title...', travelGuide.title, setTravelGuide)}
    <div className="w-full h-auto">
      <input
        accept="video/*"
        type="file"
        id="video-upload"
        className="hidden"
        onChange={handleFileChange}
      />

      {!travelGuide.imageUrl ? (
        <div className="mb-4">
          <p className="text-2xl mb-2">Insert Image</p>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="image-upload"
            className="border-red-400 border-dashed border-2 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl p-6 mt-2 rounded-md text-center block transition"
          >
            <AddIcon sx={{ height: '3rem', width: '3rem' }} /><br />
            Click to upload image
          </label>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-2xl mb-2">Added image: </p>
          <img
            src={travelGuide.imageUrl}
            alt="Preview"
            className="w-auto rounded-lg shadow-md block mx-auto"
          />

          <input
            type="file"
            id="image-upload-replace"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex justify-center w-full">
            <label
              htmlFor="image-upload-replace"
              className="mt-4 mb-4 cursor-pointer bg-[#196f75] hover:bg-[#145a5f] text-white text-lg p-2 rounded-md transition"
            >
              Reupload image
            </label>
          </div>
        </div>
      )}
    </div>
    {field('mediaUrl', 'Media Url', 'Media Url Link...', travelGuide.mediaUrl, setTravelGuide)}
    {field('date', 'Date', 'Date Posted...', travelGuide.date, setTravelGuide)}
    {field('description', 'Description', 'Enter your video description...', travelGuide.description, setTravelGuide)}

    <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
      <Button
        type="submit"
        size="large"
        sx={{ width: 120, color: "white", backgroundColor: '#196f75', borderRadius: 3, '&:hover': { backgroundColor: '#145a5f' } }}
      >
        {isEdit ? 'Edit' : 'Publish'}
      </Button>
    </Box>
  </form>
}

export default ManageGuideTemplate;