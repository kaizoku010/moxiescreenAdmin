import React, { useState } from 'react';

const EditPlaylistForm = ({ playlist, onSave }) => {
  const [timestamp, setTimestamp] = useState(playlist.timestamp);
  const [videos, setVideos] = useState(playlist.videos);
  const [screenIds, setScreenIds] = useState(playlist.screenIds || []);

  const handleAddVideo = () => {
    setVideos([...videos, { mediaKey: '', deviceId: '' }]);
  };

  const handleVideoChange = (index, field, value) => {
    const updatedVideos = videos.map((video, i) =>
      i === index ? { ...video, [field]: value } : video
    );
    setVideos(updatedVideos);
  };

  const handleRemoveVideo = index => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleAddScreenId = () => {
    setScreenIds([...screenIds, '']);
  };

  const handleScreenIdChange = (index, value) => {
    const updatedScreenIds = screenIds.map((id, i) =>
      i === index ? value : id
    );
    setScreenIds(updatedScreenIds);
  };

  const handleRemoveScreenId = index => {
    setScreenIds(screenIds.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({ ...playlist, timestamp, videos, screenIds });
  };

  return (
    <div>
      <h2>Edit Playlist</h2>
      <label>Timestamp:</label>
      <input
        type="text"
        value={timestamp}
        onChange={e => setTimestamp(e.target.value)}
      />
      <h3>Videos</h3>
      {videos.map((video, index) => (
        <div key={index}>
          <input
            type="text"
            value={video.mediaKey}
            onChange={e => handleVideoChange(index, 'mediaKey', e.target.value)}
            placeholder="Media Key"
          />
          <input
            type="text"
            value={video.deviceId}
            onChange={e => handleVideoChange(index, 'deviceId', e.target.value)}
            placeholder="Device ID"
          />
          <button onClick={() => handleRemoveVideo(index)}>Remove Video</button>
        </div>
      ))}
      <button onClick={handleAddVideo}>Add Video</button>
      <h3>Screen IDs</h3>
      {screenIds.map((id, index) => (
        <div key={index}>
          <input
            type="text"
            value={id}
            onChange={e => handleScreenIdChange(index, e.target.value)}
            placeholder="Screen ID"
          />
          <button onClick={() => handleRemoveScreenId(index)}>Remove Screen ID</button>
        </div>
      ))}
      <button onClick={handleAddScreenId}>Add Screen ID</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditPlaylistForm;
