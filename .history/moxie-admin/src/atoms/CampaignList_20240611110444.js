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
    <div className='cp-page'>
  <div className="">
      <h2 className='all-cps-title'>Recently Added Campaigns</h2>
      <ul className="campaign-list">
        {campaigns.map((campaign, index) => (
          <li className='cps-inner-list' key={index} onClick={() => navigateToCampaignDetails(campaign.id)}> {/* Navigate to campaign details onClick */}
            <div className='cp-item'>
              <h1 className="campaign-title">{campaign.name}</h1>
              <h2 className="campaign-date">{campaign.description}</h2>
            </div>
            <div className="campaign-details">
              {/* <span>Ad Type: {campaign.adType}</span> */}
              <span>Screens: {campaign.screens ? campaign.screens.join(', ') : 'No screens'}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  
    </div>
  
);
};

export default CampaignList;
