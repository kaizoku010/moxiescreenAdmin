import React, { useState } from 'react';

const EditPlaylistForm = ({ playlist, onSave, screenIds }) => {
  const [timestamp, setTimestamp] = useState(playlist.timestamp);
  const [videos, setVideos] = useState(playlist.videos);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [selectedScreenId, setSelectedScreenId] = useState('');

  const handleAddVideo = () => {
    setVideos([...videos, { mediaKey: selectedVideo, deviceId: selectedScreenId }]);
    setSelectedVideo('');
    setSelectedScreenId('');
  };

  const handleRemoveVideo = index => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({ ...playlist, timestamp, videos });
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
      <select value={selectedVideo} onChange={e => setSelectedVideo(e.target.value)}>
        <option value="">Select Video</option>
        {screenIds.map((video, index) => (
          <option key={index} value={video.mediaKey}>
            {video.mediaKey}
          </option>
        ))}
      </select>
      <select value={selectedScreenId} onChange={e => setSelectedScreenId(e.target.value)}>
        <option value="">Select Screen ID</option>
        {screenIds.map((id, index) => (
          <option key={index} value={id}>
            {id}
          </option>
        ))}
      </select>
      <button onClick={handleAddVideo}>Add Video</button>
      <ul>
        {videos.map((video, index) => (
          <li key={index}>
            {video.mediaKey} (Device ID: {video.deviceId})
            <button onClick={() => handleRemoveVideo(index)}>Remove Video</button>
          </li>
        ))}
      </ul>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditPlaylistForm;
