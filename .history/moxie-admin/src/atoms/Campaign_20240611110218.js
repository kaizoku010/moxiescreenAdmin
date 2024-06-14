import React, { useState } from 'react';
import { database, push, ref, set } from "./firebaseConfig";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./Campaign.css"

function Campaign() {
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');

  const handleCampaignNameChange = (event) => {
    setCampaignName(event.target.value);
  };

  const handleCampaignDescriptionChange = (event) => {
    setCampaignDescription(event.target.value);
  };

  const createCampaign = async () => {
    try {
      const campaignData = {
        name: campaignName,
        description: campaignDescription,
        startDate: new Date(),
        endDate: new Date(),
        // Add other properties as needed
      };

      await push(ref(database, 'campaigns'), campaignData);
      console.log("Campaign created successfully.");
      setCampaignName("")
      setCampaignDescription("")
      alert("Campaign created successfully.")
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
<div>

</div>
    
);
}

export default Campaign;
