import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database, ref, get, push, set, update, remove } from './firebaseConfig';
import CircularProgress from '@mui/material/CircularProgress';
import Playlist from './Playlist'; // Import the Playlist component
import EditCampaignForm from './EditCampaignForm'; // Import the EditCampaignForm component
import './CampaignDetails.css';

const CampaignDetails = () => {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState(null);
  const [editing, setEditing] = useState(false); // State to handle edit mode

  const screenIds = ['MX5S001', 'MX5S002', 'MX5S003', 'MX5S004', 'MX5S005', 'MX5S006'];

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
        const foundPlaylist = Object.values(playlists).find(playlist => playlist.campaignId === campaignId);
        setPlaylist(foundPlaylist);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
    fetchCampaign();
  }, [campaignId]);

  const handlePlaylistSelection = async selectedPlaylist => {
    try {
      const newPlaylistRef = push(ref(database, 'playlist')); // Use 'playlist' path directly
      await set(newPlaylistRef, { ...selectedPlaylist, campaignId }); // Ensure campaignId is included
      console.log('Playlist added to campaign:', selectedPlaylist);
      setPlaylist(selectedPlaylist); // Update the state with the new playlist
    } catch (error) {
      console.error('Error adding playlist to campaign:', error);
    }
  };

  const handleUpdateCampaign = async updatedCampaign => {
    try {
      const campaignRef = ref(database, `campaigns/${campaignId}`);
      await update(campaignRef, updatedCampaign);
      setCampaign(updatedCampaign);
      console.log('Campaign updated:', updatedCampaign);
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const handleDeleteCampaign = async () => {
    try {
      const campaignRef = ref(database, `campaigns/${campaignId}`);
      await remove(campaignRef);
      console.log('Campaign deleted');
      // Redirect or update UI after deletion
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleUpdatePlaylist = async updatedPlaylist => {
    try {
      const playlistRef = ref(database, `playlist/${playlist.id}`);
      await update(playlistRef, updatedPlaylist);
      setPlaylist(updatedPlaylist);
      console.log('Playlist updated:', updatedPlaylist);
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      const playlistRef = ref(database, `playlist/${playlist.id}`);
      await remove(playlistRef);
      console.log('Playlist deleted');
      setPlaylist(null); // Update the state to reflect the deletion
    } catch (error) {
      console.error('Error deleting playlist:', error);
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

        {!editing ? (
          <div>
            <button onClick={() => setEditing(true)}>Edit Campaign</button>
            <button onClick={handleDeleteCampaign}>Delete Campaign</button>
          </div>
        ) : (
          <EditCampaignForm
            campaign={campaign}
            onSave={updatedCampaign => {
              handleUpdateCampaign(updatedCampaign);
              setEditing(false);
            }}
          />
        )}

        {!playlist && (
          <Playlist onPlaylistSelect={handlePlaylistSelection} id={campaignId} screenIds={screenIds} />
        )}

        {playlist && (
          <div className="playlist-details">
            <h2>Playlist Details</h2>
            <p>Timestamp: {playlist.timestamp}</p>
            <ul>
              {playlist.videos.map((video, index) => (
                <li key={index}>
                  {video.mediaKey} (Device ID: {video.deviceId})
                </li>
              ))}
            </ul>
            <button onClick={() => handleUpdatePlaylist({ ...playlist, timestamp: Date.now() })}>
              Edit Playlist
            </button>
            <button onClick={handleDeletePlaylist}>Delete Playlist</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;
