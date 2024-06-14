import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database, ref, get, set, push } from "./firebaseConfig";
import CircularProgress from "@mui/material/CircularProgress";
import Playlist from "./Playlist"; // Import the Playlist component
import TextareaAutosize from "@mui/material/TextareaAutosize"; // Import TextareaAutosize from Material-UI
import TextField from "@mui/material/TextField"; // Import TextField from Material-UI
import Button from "@mui/material/Button"; // Import Button from Material-UI
import "./CampaignDetails.css";

const CampaignDetails = () => {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      const campaignRef = ref(database, `campaigns/${campaignId}`);
      try {
        const snapshot = await get(campaignRef);
        const campaignData = snapshot.val();
        setCampaign(campaignData);
        setCampaignName(campaignData.name);
        setCampaignDescription(campaignData.description);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlaylist = async () => {
      const playlistRef = ref(database, "playlist");
      try {
        const snapshot = await get(playlistRef);
        const playlists = snapshot.val();
        // Find the playlist that contains the campaignId
        const foundPlaylist = Object.values(playlists).find(
          (playlist) => playlist.campaignId === campaignId
        );
        setPlaylist(foundPlaylist);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };
    fetchPlaylist();
    fetchCampaign();
  }, [campaignId]);

  const handlePlaylistSelection = async (selectedPlaylist) => {
    const campaignRef = ref(database, `campaigns/${campaignId}`);

    try {
      // Generate a unique key for the playlist item
      const newPlaylistRef = push(ref(campaignRef, "playlists"));

      // Set the playlist item with the selected playlist under the generated key
      await set(newPlaylistRef, selectedPlaylist);

      console.log("Playlist added to campaign:", selectedPlaylist);
    } catch (error) {
      console.error("Error adding playlist to campaign:", error);
    }
  };

  const handleSaveCampaignChanges = async () => {
    const campaignRef = ref(database, `campaigns/${campaignId}`);
    try {
      await set(campaignRef, {
        ...campaign,
        name: campaignName,
        description: campaignDescription,
      });
      setEditingCampaign(false);
      console.log("Campaign details updated successfully.");
    } catch (error) {
      console.error("Error updating campaign details:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  return (
    <div className="cp-details-top-level">
      <div className="campaign-details-container">
        {editingCampaign ? (
          <div>
            <TextField
              label="Campaign Name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
            <TextareaAutosize
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
              aria-label="campaign-description"
              placeholder="Campaign Description"
              minRows={3}
            />
            <Button onClick={handleSaveCampaignChanges}>
              Save Campaign Changes
            </Button>

            {/* Display playlist details during editing */}
            {playlist && (
              <div className="playlist-details">
                <h2>Playlist Details</h2>
                <p>Timestamp: {playlist.timestamp}</p>
                <ul>
                  {playlist.videos.map((video, index) => (
                    <li key={index}>{video.mediaKey}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1 className="campaign-title">{campaign.name}</h1>
            <p className="campaign-description">{campaign.description}</p>
            <Button onClick={() => setEditingCampaign(true)}>
              Edit Campaign
            </Button>
          </div>
        )}

        {/* Render the Playlist component */}
        {!playlist && (
          <Playlist onPlaylistSelect={handlePlaylistSelection} id={campaignId} />
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;
