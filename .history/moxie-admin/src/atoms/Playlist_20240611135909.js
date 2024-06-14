import React, { useState, useEffect } from 'react';
import AWS from "aws-sdk";
import { database, push, ref } from "./firebaseConfig";
import './playlist.css'; // Import CSS file for styling

const Playlist = (onPlaylistSelect) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
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



        console.log('Video list 2:', videoList); // Debug

        const videoData = videoList.Contents.map((video) => {
          const mediaKey = video.Key;
          const mediaUrl = `https://${video.Bucket}/${video.Key}`;
          return { mediaKey, mediaUrl };
        });

        console.log('Video data:', videoData); // Debug

        setVideos(videoData);
      } catch (error) {
        console.error('Error fetching videos from S3:', error);
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
      <h2>Create Playlist</h2>
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
      <button className="add-button" onClick={addToPlaylist}>Add to Playlist</button>
    </div>
  );
};

export default Playlist;
