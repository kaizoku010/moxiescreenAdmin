import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook for navigation
import { database, ref, get, off } from './firebaseConfig';
import './CampaignList.css';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaignsRef = ref(database, 'campaigns');
      try {
        const snapshot = await get(campaignsRef);
        const campaignData = snapshot.val();
        const campaignList = campaignData ? Object.values(campaignData) : [];
        setCampaigns(campaignList);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchCampaigns();

    return () => {
      off(ref(database, 'campaigns'));
    };
  }, []);

  const navigateToCampaignDetails = (campaignId) => {
    navigate(`/campaign-details"/${campaignId}`); // Navigate to campaign details page
  };

  return (
    <div>

    </div>
  
);
};

export default CampaignList;
