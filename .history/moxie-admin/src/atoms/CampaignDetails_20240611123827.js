import React, { useState, useEffect, useMemo } from "react";
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
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistVideos, setNewPlaylistVideos] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState("");
  const [availableVideos, setAvailableVideos] = useState([]);
  const screenIds = ["MX5S001", "MX5S002", "MX5S003", "MX5S004", "MX5S005", "MX5S006"];

  useEffect(() => {
    const fetchCampaign = async () => {
      const campaignRef = ref(database, `campaigns/${id}`);
      const snapshot = await get(campaignRef);
      if (snapshot.exists()) {
        setCampaign(snapshot.val());
        setSelectedPlaylistId(snapshot.val().playlistId || "");
      }
    };

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

    const fetchAvailableMedia = async () => {
      const S3_BUCKET = "moxiescreen";
      const REGION = "ap-south-1";
    
      AWS.config.update({
        region: REGION,
        credentials: {
          accessKeyId: "YOUR_ACCESS_KEY_ID",
          secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
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

  const memoizedPlaylists = useMemo(() => {
    return playlists.map((playlist) => (
      <MenuItem key={playlist.id} value={playlist.id}>
        {playlist.name}
      </MenuItem>
    ));
  }, [playlists]);

  const memoizedScreenIds = useMemo(() => {
    return screenIds.map((screenId) => (
      <MenuItem key={screenId} value={screenId}>
        {screenId}
      </MenuItem>
    ));
  }, []);

  // Handle adding a video to the new playlist
  const handleAddVideoToPlaylist = (video) => {
    setNewPlaylistVideos((prevVideos) => [...prevVideos, video]);
  };

  // Handle saving the new playlist to Firebase
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
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
              input={<OutlinedInput label="Select Playlist" />}
            >
              {memoizedPlaylists}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => {}}>
            Save
          </Button>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="screen-select-label">Select Screen ID</InputLabel>
            <Select
              labelId="screen-select-label"
              id="screen-select"
              value={selectedScreenId}
              onChange={(e) => setSelectedScreenId(e.target.value)}
              input={<OutlinedInput label="Select Screen ID" />}
            >
              {memoizedScreenIds}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => {}}>
            Push Playlist to Screen
          </Button>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Create New Playlist</Typography>
            <TextField
              fullWidth
              label="Playlist Name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
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
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

export default CampaignDetails;

