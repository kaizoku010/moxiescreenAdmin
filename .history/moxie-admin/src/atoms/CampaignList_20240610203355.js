import React, { useState, useEffect } from 'react';
import { database, ref, get, off } from './firebaseConfig';
import './CampaignList.css'; // Import CSS file for styling

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaignsRef = ref(database, 'campaigns'); // Reference to the campaigns in Firebase
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
      // Unsubscribe from Firebase updates when the component unmounts
      off(ref(database, 'campaigns'));
    };
  }, []);

  return (
    <div className="campaign-list-container">
      <h2>All Campaigns</h2>
      <ul className="campaign-list">
        {campaigns.map((campaign, index) => (
          <li key={index}>
            <div>
              <h1 className="campaign-title">Title: {campaign.name}</h1><br/>
              <span className="campaign-date">{campaign.description}</span>
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
