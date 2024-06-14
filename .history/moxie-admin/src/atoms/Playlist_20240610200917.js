import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Playlist() {
  const [videoUrl, setVideoUrl] = useState('');

  const handleVideoUrlChange = (event) => {
    setVideoUrl(event.target.value);
  };

  const addToPlaylist = () => {
    // Implement adding video URL to the playlist
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
