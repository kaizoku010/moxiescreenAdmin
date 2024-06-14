import React, { useEffect, useState } from "react";
import VideoCardHolder from "./VideoCardHolder";
import AdList from "./AdList";
import AWS from "aws-sdk";
import "./AllScreens.css"
import { getObjectMetadata } from "../DataLayer/AWSLayer";
import io from 'socket.io-client';


function AllVideos() {
  const [videos, setVideos] = useState([]);
  const [createdAt, setCreatedAt] = useState();
  const [size, setSize] = useState();
  const [videoKey_, setVideoKey] = useState();
  const [batteryLevel, setBatteryLevel] = useState(null);


  const socket = io('http://192.168.124.2:4000'); // Replace with your server IP or domain


  useEffect(() => {
    const fetchVideos = async () => {
      const S3_BUCKET = "moxiescreen";
      const REGION = "ap-south-1";
    
      AWS.config.update({
        region: REGION,
        credentials: {
          accessKeyId: "YOUR_ACCESS_KEY_ID",
          secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
        },
      });
    
      const myBucket = new AWS.S3({
        params: { Bucket: S3_BUCKET },
        region: REGION,
      });
    
      try {
        const objects = await myBucket.listObjects().promise();
    
        // Filter both videos and images
        const mediaObjects = objects.Contents.filter((object) =>
          object.Key.endsWith(".mp4") || object.Key.endsWith(".jpg") || object.Key.endsWith(".png")
        );
    
        console.log ("list of images as well as videos: ", mediaObjects)
        // Retrieve thumbnails for videos and images
        const mediaList = await Promise.all(
          mediaObjects.map(async (mediaObject) => {
            const mediaKey = mediaObject.Key;
            const mediaType = mediaKey.endsWith(".mp4") ? "video" : "image";
            const thumbnailKey = mediaType === "video" ? `thumbnails/${mediaKey}.jpg` : mediaKey;
    
            const [metadata, thumbnailUrl] = await Promise.all([
              myBucket.headObject({ Bucket: S3_BUCKET, Key: mediaKey }).promise(),
              myBucket.getSignedUrlPromise("getObject", { Bucket: S3_BUCKET, Key: thumbnailKey }),
            ]);
    
            const title = metadata.Metadata["x-amz-meta-title"];
            const description = metadata.Metadata["x-amz-meta-description"];
    
            return {
              mediaKey,
              mediaType,
              title,
              description,
              thumbnailUrl,
            };
          })
        );
    
        setVideos(mediaList);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    

    
    fetchVideos();

    socket.on('battery-level', (data) => {
      console.log('Battery level React Native: ', data);
      setBatteryLevel(data.level);
    });

    return () => {
      socket.off('battery-level');
    };

  }, []);

 
  return (
    <div className="all-videos">
      <p className="welcome-text">Welcome to your video libray {batteryLevel}</p>
      <div>
        <VideoCardHolder />
      </div>
      {videos.map((ad) => (
        <AdList
          title={ad.videoKey}
          thumb={ad.thumbnailUrl}
          desc={ad.description}
          video={videos}
          date={createdAt}
          size={size}
        />
      ))}
    </div>
  );
}

export default AllVideos;
