import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database, ref, get, push, set } from './firebaseConfig';
import CircularProgress from '@mui/material/CircularProgress';
import Playlist from './Playlist'; // Import the Playlist component
import './CampaignDetails.css';

const CampaignDetails = () => {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
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

    fetchCampaign();
  }, [campaignId]);

  const renderPlaylists = () => {
    if (!campaign || !campaign.playlists) {
      return <div>No playlists found for this campaign</div>;
    }

    return (
      <div className="playlist-container">
        <h2>Playlists</h2>
        {Object.entries(campaign.playlists).map(([playlistId, playlist]) => (
          <Playlist key={playlistId} playlistId={playlistId} playlist={playlist} />
        ))}
      </div>
    );
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
    <div className='cp-details-page'>
      <h1 className='cpd'>Campaign Details</h1>
      <div className='campaign-details-page'>
        <h1 className='campaign-title'>{campaign.name}</h1>
        <p className='campaign-description'>{campaign.description}</p>
        {/* Render more details about the campaign as needed */}
      </div>
      {renderPlaylists()}
    </div>
  );
};

export default CampaignDetails;
