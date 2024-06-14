import React, { useState } from 'react';
import { database, push, ref, set } from "./firebaseConfig";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "."

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
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <div>
      <h2>Create Campaign</h2>
      <TextField
        label="Campaign Name"
        value={campaignName}
        onChange={handleCampaignNameChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Campaign Description"
        value={campaignDescription}
        onChange={handleCampaignDescriptionChange}
        fullWidth
        margin="normal"
      />
      <Button className='' variant="contained" color="primary" onClick={createCampaign}>
        Create Campaign
      </Button>
    </div>
  );
}

export default Campaign;
