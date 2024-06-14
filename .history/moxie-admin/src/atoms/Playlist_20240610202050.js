import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import playlis

function Playlist() {
  const [videoUrl, setVideoUrl] = useState('');

  const handleVideoUrlChange = (event) => {
    setVideoUrl(event.target.value);
  };
  const addToPlaylist = () => {
    // Check if the video URL is not empty
    if (videoUrl.trim() !== '') {
      // Update the playlist state by adding the new video URL
      setPlaylist([...playlist, videoUrl]);
      // Clear the input field after adding the video URL
      setVideoUrl('');
    } else {
      // Handle empty video URL case
      console.log('Please enter a valid video URL.');
    }
  };
  

  return (
    <div>
      <h2>Add to Playlist</h2>
      <TextField
        label="Video URL"
        value={videoUrl}
        onChange={handleVideoUrlChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={addToPlaylist}>
        Add to Playlist
      </Button>
    </div>
  );
}

export default Playlist;
