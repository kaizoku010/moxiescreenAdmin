import React, { useState, useEffect } from 'react';
import { S3 } from 'aws-sdk';
import { database, push, ref, set } from "./firebaseConfig";
import './Playlist.css'; // Import CSS file for styling

const Playlist = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  useEffect(() => {
    const s3 = new S3({
        accessKeyId: "AKIAQ3EGP2YOTF7EHSMS",
        secretAccessKey: "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",
      region: 'ap-south-1',
    });

    const fetchVideosFromS3 = async () => {
      try {
        const videoList = await s3.listObjectsV2({
          Bucket: 'YOUR_BUCKET_NAME',
          Prefix: 'videos/', // Specify the prefix for your videos
        }).promise();

        // Extract video URLs from the response and update the state
        const videoUrls = videoList.Contents.map((video) => {
          return `https://${video.Bucket}/${video.Key}`;
        });

        setVideos(videoUrls);
      } catch (error) {
        console.error('Error fetching videos from S3:', error);
      }
    };

    fetchVideosFromS3();
  }, []);

  const handleVideoSelection = (event, videoUrl) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedVideos([...selectedVideos, videoUrl]);
    } else {
      setSelectedVideos(selectedVideos.filter((url) => url !== videoUrl));
    }
  };

  const addToPlaylist = async () => {
    try {
      const playlistRef = ref(database, 'playlist'); // Reference to the playlist in Firebase
      const playlistItem = {
        videos: selectedVideos,
        timestamp: new Date().toISOString(),
      };

      // Add the selected videos to the playlist in Firebase
      await push(playlistRef, playlistItem);
      console.log('Selected videos added to the playlist:', selectedVideos);
    } catch (error) {
      console.error('Error adding videos to the playlist:', error);
    }
  };

  return (
    <div className="playlist-container">
      <h2>Playlist</h2>
      <ul className="video-list">
        {videos.map((video, index) => (
          <li key={index}>
            <input
              type="checkbox"
              id={`video-${index}`}
              value={video}
              onChange={(event) => handleVideoSelection(event, video)}
            />
            <label htmlFor={`video-${index}`}>{video}</label>
          </li>
        ))}
      </ul>
      <button className="add-button" onClick={addToPlaylist}>Add to Playlist</button>
    </div>
  );
};

export default Playlist;
