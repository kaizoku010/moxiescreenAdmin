import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory hook for navigation
import { database, ref, get, off } from './firebaseConfig';
import './CampaignList.css';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
//   const history = useHistory();

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
    history.push(`/campaign-details"/${campaignId}`); // Navigate to campaign details page
  };

  return (
    <div className="campaign-list-container">
      <h2>All Campaigns</h2>
      <ul className="campaign-list">
        {campaigns.map((campaign, index) => (
          <li key={index} onClick={() => navigateToCampaignDetails(campaign.id)}> {/* Navigate to campaign details onClick */}
            <div>
              <h1 className="campaign-title">Title: {campaign.name}</h1>
              <h1 className="campaign-date">Description: {campaign.description}</h1>
            </div>
            <div className="campaign-details">
              <span>Ad Type: {campaign.adType}</span>
              <span>Screens: {campaign.screens ? campaign.screens.join(', ') : 'No screens'}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignList;
