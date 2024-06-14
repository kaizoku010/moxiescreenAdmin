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
    <h1 className='cpd'>Campaign Details</h1>
<div className='campaign-details-page'>
      <h1 className='campaign-title'>{campaign.name}</h1>
      <p className='campaign-description'>{campaign.description}</p>
      {/* Render more details about the campaign as needed */}
    </div>
</div>
   

  );
};

export default CampaignDetails;

const s3 = new S3({
    accessKeyId: "AKIAQ3EGP2YOTF7EHSMS",
    secretAccessKey: "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",
  region: 'ap-south-1',
  params:{Bucket:"moxiescreen"}
});

const videoList = await s3.listObjectsV2({
    Bucket: 'moxiescreen',
    Prefix: 'videos/', // Specify the prefix for your videos
  }).promise();
