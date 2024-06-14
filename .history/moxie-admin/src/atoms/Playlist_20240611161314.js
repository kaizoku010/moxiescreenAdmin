import React, { useState, useEffect } from 'react';
import AWS from "aws-sdk";
import { database, push, ref } from "./firebaseConfig";
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from Material-UI
import './playlist.css'; // Import CSS file for styling

const Playlist = ({ id }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const S3_BUCKET = "moxiescreen";
  const REGION = "ap-south-1";

  useEffect(() => {
    AWS.config.update({
      region: REGION,
      credentials: {
        accessKeyId: "AKIAQ3EGP2YOTF7EHSMS",
        secretAccessKey: "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",
      },
    });

    const fetchVideosFromS3 = async () => {
      try {
        const myBucket = new AWS.S3({
          params: { Bucket: S3_BUCKET },
          region: REGION,
        });   

        const videoList = await myBucket.listObjects().promise();

        const videoData = videoList.Contents
          .filter(video => !video.Key.startsWith('thumbnails/')) // Filter out objects in the thumbnails folder
          .map((video) => {
            const mediaKey = video.Key;
            return { mediaKey };
          });

        setVideos(videoData);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching videos from S3:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchVideosFromS3();
  }, []);

  const handleVideoSelection = (event, video) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedVideos([...selectedVideos, video]);
    } else {
      setSelectedVideos(selectedVideos.filter((v) => v.mediaKey !== video.mediaKey));
    }
  };

  const addToPlaylist = async () => {
    try {
      const playlistRef = ref(database, 'playlist'); // Reference to the playlist in Firebase
    
      const playlistItem = {
        videos: selectedVideos,
        timestamp: new Date().toISOString(),
        campaignId: id
      };

      await push(playlistRef, playlistItem);
      console.log('Selected videos added to the playlist:', selectedVideos);
    } catch (error) {
      console.error('Error adding videos to the playlist:', error);
    }
  };

  return (
    <div className="playlist-container">
      <h2>Create A Playlist Of Ads For This Campaign </h2>
      {loading ? (
        <div className="loading-container">
          <CircularProgress /> {/* Show spinner while loading */}
        </div>
      ) : (
        <ul className="video-list">
          {videos.map((video, index) => (
            <li key={index}>
              <input
                type="checkbox"
                id={`video-${index}`}
                checked={selectedVideos.some((v) => v.mediaKey === video.mediaKey)}
                onChange={(event) => handleVideoSelection(event, video)}
              />
              <label htmlFor={`video-${index}`}>{video.mediaKey}</label>
            </li>
          ))}
        </ul>
      )}
      <button className="add-button" onClick={addToPlaylist}>Add to Playlist</button>
    </div>
  );
};

export default Playlist;
