import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database, ref, get } from './firebaseConfig';
import CircularProgress from '@mui/material/CircularProgress';
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
<div className='campaign-details-page'>
      <h1 className='campaign-title'>{campaign.name}</h1>
      <p className='campaign-description'>{campaign.description}</p>
      {/* Render more details about the campaign as needed */}
    </div>
</div>
   

  );
};

export default CampaignDetails;
