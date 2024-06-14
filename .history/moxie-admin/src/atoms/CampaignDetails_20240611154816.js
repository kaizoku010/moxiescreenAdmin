import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database, ref, get } from './firebaseConfig';
import CircularProgress from '@mui/material/CircularProgress';
import './CampaignDetails.css';

const CampaignDetails = () => {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      const campaignRef = ref(database, `campaigns/${campaignId}`);
      try {
        const snapshot = await get(campaignRef);
        const campaignData = snapshot.val();
        setCampaign(campaignData);
      } catch (error) {
        console.error('Error fetching campaign:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlaylist = async () => {
      const playlistRef = ref(database, 'playlist');
      try {
        const snapshot = await get(playlistRef);
        const playlists = snapshot.val();
        // Find the playlist that contains the campaignId
        const foundPlaylist = Object.values(playlists).find(
          (playlist) => playlist.campaignId === campaignId
        );
        setPlaylist(foundPlaylist);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchCampaign();
    fetchPlaylist();
  }, [campaignId]);

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
    <div className="campaign-details-container">
      <h1 className="campaign-title">{campaign.name}</h1>
      <p className="campaign-description">{campaign.description}</p>
      {/* Render more details about the campaign as needed */}
      
      {playlist && (
        <div className="playlist-details">
          <h2>Playlist Details</h2>
          <p>Timestamp: {playlist.timestamp}</p>
          <h3>Videos:</h3>
          <ul>
            {playlist.videos.map((video, index) => (
              <li key={index}>{video}</li>
            ))}
          </ul>
          {/* Render other playlist details here */}
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
