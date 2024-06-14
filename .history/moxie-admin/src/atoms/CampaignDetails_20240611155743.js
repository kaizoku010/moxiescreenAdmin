import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database, ref, get, update } from './firebaseConfig';
import CircularProgress from '@mui/material/CircularProgress';
import Playlist from './Playlist'; // Import the Playlist component
import './CampaignDetails.css';

const CampaignDetails = () => {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchCampaignAndPlaylist = async () => {
      try {
        // Fetch campaign details
        const campaignSnapshot = await get(ref(database, `campaigns/${campaignId}`));
        const campaignData = campaignSnapshot.val();
        setCampaign(campaignData);

        // Fetch playlist details
        const playlistSnapshot = await get(ref(database, 'playlist'));
        const playlists = playlistSnapshot.val();
        const foundPlaylist = Object.values(playlists).find(playlist => playlist.campaignId === campaignId);
        setPlaylist(foundPlaylist);
      } catch (error) {
        console.error('Error fetching campaign and playlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignAndPlaylist();
  }, [campaignId]);

  const handleSaveCampaignChanges = async () => {
    try {
      await update(ref(database, `campaigns/${campaignId}`), campaign);
      console.log('Campaign details updated successfully');
    } catch (error) {
      console.error('Error updating campaign details:', error);
    }
  };

  const handleSavePlaylistChanges = async () => {
    try {
      await update(ref(database, 'playlist'), { [playlist.id]: playlist });
      console.log('Playlist details updated successfully');
    } catch (error) {
      console.error('Error updating playlist details:', error);
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
        <h1 className="campaign-title">{campaign.name}</h1>
        <p className="campaign-description">{campaign.description}</p>
        {/* Campaign details form */}
        <button onClick={handleSaveCampaignChanges}>Save Campaign Changes</button>
      </div>
      {playlist && (
        <div className="playlist-details">
          <h2>Playlist Details</h2>
          <p>Timestamp: {playlist.timestamp}</p>
          <ul>
            {playlist.videos.map((video, index) => (
              <li key={index}>{video.mediaKey}</li>
            ))}
          </ul>
          {/* Playlist details form */}
          <button onClick={handleSavePlaylistChanges}>Save Playlist Changes</button>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
