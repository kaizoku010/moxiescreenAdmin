import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database, ref, get, set, push } from "./firebaseConfig";
import AWS from "aws-sdk";
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
import AddIcon from "@mui/icons-material/Add";

const CampaignDetails = () => {
  const { id } = useParams(); // Get campaign ID from URL parameters
  const [campaign, setCampaign] = useState(null); // State for storing campaign data
  const [playlists, setPlaylists] = useState([]); // State for storing playlists
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(""); // State for selected playlist ID
  const [newPlaylistName, setNewPlaylistName] = useState(""); // State for new playlist name
  const [newPlaylistVideos, setNewPlaylistVideos] = useState([]); // State for new playlist videos
  const [selectedScreenId, setSelectedScreenId] = useState(""); // State for selected screen ID
  const [availableVideos, setAvailableVideos] = useState([]); // State for available videos

  const screenIds = ["MX5S001", "MX5S002", "MX5S003", "MX5S004", "MX5S005", "MX5S006"]; // Example screen IDs

  useEffect(() => {
    // Fetch campaign data from Firebase
    const fetchCampaign = async () => {
      const campaignRef = ref(database, `campaigns/${id}`);
      const snapshot = await get(campaignRef);
      if (snapshot.exists()) {
        setCampaign(snapshot.val());
        setSelectedPlaylistId(snapshot.val().playlistId || "");
      }
    };

    // Fetch playlists from Firebase
    const fetchPlaylists = async () => {
      const playlistsRef = ref(database, "playlists");
      const snapshot = await get(playlistsRef);
      if (snapshot.exists()) {
        const playlistsData = snapshot.val();
        const playlistsArray = Object.keys(playlistsData).map((key) => ({
          id: key,
          ...playlistsData[key],
        }));
        setPlaylists(playlistsArray);
      }
    };

    // Fetch available videos and images from S3 bucket
    const fetchAvailableMedia = async () => {
      const S3_BUCKET = "moxiescreen";
      const REGION = "ap-south-1";
    
      AWS.config.update({
        region: REGION,
        credentials: {
          accessKeyId: "AKIAQ3EGP2YOTF7EHSMS",
          secretAccessKey: "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",
        },
      });
    
      const myBucket = new AWS.S3({
        params: { Bucket: S3_BUCKET },
        region: REGION,
      });
    
      try {
        const objects = await myBucket.listObjects().promise();
        const mediaObjects = objects.Contents.filter(
          (object) =>
            (object.Key.endsWith(".mp4") ||
              object.Key.endsWith(".jpg") ||
              object.Key.endsWith(".jpeg") ||
              object.Key.endsWith(".png")) &&
            !object.Key.startsWith("thumbnails/")
        );
        const mediaList = await Promise.all(
          mediaObjects.map(async (mediaObject) => {
            const mediaKey = mediaObject.Key;
            const mediaType = mediaKey.endsWith(".mp4") ? "video" : "image";
            const thumbnailKey = mediaType === "video" ? `thumbnails/${mediaKey}.jpg` : mediaKey;
    
            const [metadata, thumbnailUrl] = await Promise.all([
              myBucket.headObject({ Bucket: S3_BUCKET, Key: mediaKey }).promise(),
              myBucket.getSignedUrlPromise("getObject", { Bucket: S3_BUCKET, Key: thumbnailKey }),
            ]);
    
            const title = metadata.Metadata["x-amz-meta-title"];
            const description = metadata.Metadata["x-amz-meta-description"];
    
            return {
              mediaKey,
              mediaType,
              title,
              description,
              thumbnailUrl,
            };
          })
        );
    
        setAvailableVideos(mediaList);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchCampaign();
    fetchPlaylists();
    fetchAvailableMedia();
  }, [id]);

  // Handle change of selected playlist
  const handlePlaylistChange = (event) => {
    setSelectedPlaylistId(event.target.value);
  };

  // Handle change of selected screen ID
  const handleScreenIdChange = (event) => {
    setSelectedScreenId(event.target.value);
  };

  // Handle change of new playlist name
  const handleNewPlaylistNameChange = (event) => {
    setNewPlaylistName(event.target.value);
  };

  // Add a video to the new playlist
  const handleAddVideoToPlaylist = (video) => {
    setNewPlaylistVideos((prevVideos) => [...prevVideos, video]);
  };

  // Save the new playlist to Firebase
  const handleSaveNewPlaylist = async () => {
    const newPlaylistRef = push(ref(database, "playlists"));
    const newPlaylist = {
      name: newPlaylistName,
      videos: newPlaylistVideos.map((video) => video.mediaKey), // Use mediaKey instead of id
      timestamp: new Date().toISOString(),
    };
    await set(newPlaylistRef, newPlaylist);
    alert("Playlist created successfully!");
    setNewPlaylistName("");
    setNewPlaylistVideos([]);
  };

  // Save the campaign with the selected playlist ID to Firebase
  const handleSaveCampaign = async () => {
    const campaignRef = ref(database, `campaigns/${id}`);
    await set(campaignRef, {
      ...campaign,
      playlistId: selectedPlaylistId,
    });
    alert("Campaign updated successfully!");
  };

  // Push the selected playlist to the selected screen
  const handlePushPlaylistToScreen = async () => {
    const screenRef = ref(database, `screens/${selectedScreenId}`);
    await set(screenRef, {
      playlistId: selectedPlaylistId,
    });
    alert("Playlist pushed to screen successfully!");
  };

  return (
    <Box>
      {campaign ? (
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
              {screenIds.map((screenId) => (
                <MenuItem key={screenId} value={screenId}>
                  {screenId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handlePushPlaylistToScreen}>
            Push Playlist to Screen
          </Button>
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
                    <AddIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveNewPlaylist}>
              Save New Playlist
            </Button>
          </Box>
        </>
      ) }
    </Box>
  );
};

export default CampaignDetails;

