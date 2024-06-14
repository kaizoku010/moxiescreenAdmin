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

  const handlePlaylistSelection = async (selectedPlaylist) => {
    const campaignRef = ref(database, `campaigns/${campaignId}`);
  
    try {
      // Generate a unique key for the playlist item
      const newPlaylistRef = push(ref(campaignRef, 'playlists'));
  
      // Set the playlist item with the selected playlist under the generated key
      await set(newPlaylistRef, selectedPlaylist);
  
      console.log('Playlist added to campaign:', selectedPlaylist);
    } catch (error) {
      console.error('Error adding playlist to campaign:', error);
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
    <div className='c'>
       <div className="campaign-details-container">
      <h1 className="campaign-title">{campaign.name}</h1>
      <p className="campaign-description">{campaign.description}</p>
      {/* Render more details about the campaign as needed */}
      
      {/* Render the Playlist component */}
      <Playlist onPlaylistSelect={handlePlaylistSelection} id={campaignId} />
    </div>    
    </div>
 
  );
};

export default CampaignDetails;
