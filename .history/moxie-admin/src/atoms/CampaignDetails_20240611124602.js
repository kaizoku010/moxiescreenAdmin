import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database, ref, get } from "./firebaseConfig";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistVideos, setNewPlaylistVideos] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState("");
  const [availableVideos, setAvailableVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaignRef = ref(database, `campaigns/${id}`);
        const campaignSnapshot = await get(campaignRef);
        if (campaignSnapshot.exists()) {
          setCampaign(campaignSnapshot.val());
          setSelectedPlaylistId(campaignSnapshot.val().playlistId || "");
        }

        const playlistsRef = ref(database, "playlists");
        const playlistsSnapshot = await get(playlistsRef);
        if (playlistsSnapshot.exists()) {
          const playlistsData = playlistsSnapshot.val();
          const playlistsArray = Object.keys(playlistsData).map((key) => ({
            id: key,
            ...playlistsData[key],
          }));
          setPlaylists(playlistsArray);
        }

        // Simulate delay for fetching available media
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Set loading to false after all data is fetched
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handlePlaylistChange = (event) => {
    setSelectedPlaylistId(event.target.value);
  };

  const handleScreenIdChange = (event) => {
    setSelectedScreenId(event.target.value);
  };

  const handleNewPlaylistNameChange = (event) => {
    setNewPlaylistName(event.target.value);
  };

  const handleAddVideoToPlaylist = (video) => {
    setNewPlaylistVideos((prevVideos) => [...prevVideos, video]);
  };

  const handleSaveNewPlaylist = async () => {
    // Implement saving new playlist logic
  };

  const handleSaveCampaign = async () => {
    // Implement saving campaign logic
  };

  const handlePushPlaylistToScreen = async () => {
    // Implement pushing playlist to screen logic
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
        jjh
      {campaign && (
        <>
          <Typography variant="h4">{campaign.name}</Typography>
          <Typography variant="body1">{campaign.description}</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="playlist-select-label">Select Playlist</InputLabel>
            <Select
              labelId="playlist-select-label"
              id="playlist-select"
              value={selectedPlaylistId}
              onChange={handlePlaylistChange}
              input={<OutlinedInput label="Select Playlist" />}
            >
              {playlists.map((playlist) => (
                <MenuItem key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveCampaign}>
            Save
          </Button>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="screen-select-label">Select Screen ID</InputLabel>
            <Select
              labelId="screen-select-label"
              id="screen-select"
              value={selectedScreenId}
              onChange={handleScreenIdChange}
              input={<OutlinedInput label="Select Screen ID" />}
            >
              {["MX5S001", "MX5S002", "MX5S003", "MX5S004", "MX5S005", "MX5S006"].map((screenId) => (
                <MenuItem key={screenId} value={screenId}>
                  {screenId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handlePushPlaylistToScreen}>
            Push Playlist to Screen
          </Button>
          {/* Create New Playlist */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Create New Playlist</Typography>
            <TextField
              fullWidth
              label="Playlist Name"
              value={newPlaylistName}
              onChange={handleNewPlaylistNameChange}
              sx={{ mt: 2 }}
            />
            <Typography variant="body1" sx={{ mt: 2 }}>Add Videos and Images to Playlist:</Typography>
            <List>
              {availableVideos.map((video) => (
                <ListItem key={video.mediaKey} button onClick={() => handleAddVideoToPlaylist(video)}>
                  <ListItemText primary={video.title || video.mediaKey} secondary={video.description} />
                  <IconButton edge="end" color="primary">
                    {/* <AddIcon /> */}
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveNewPlaylist}>
              Save New Playlist
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CampaignDetails;
