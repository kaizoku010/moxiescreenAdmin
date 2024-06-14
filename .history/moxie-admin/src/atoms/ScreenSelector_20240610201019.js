import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function ScreenSelector() {
  const [selectedScreens, setSelectedScreens] = useState([]);

  const handleScreenSelection = (event) => {
    // Implement screen selection logic
  };

  const addScreensToPlaylist = () => {
    // Implement adding screens to the playlist
  };

  return (
    <div>
      <h2>Select Screens</h2>
      <TextField
        label="Screen ID"
        value={selectedScreens}
        onChange={handleScreenSelection}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={addScreensToPlaylist}>
        Add Screens to Playlist
      </Button>
    </div>
  );
}

export default ScreenSelector;
