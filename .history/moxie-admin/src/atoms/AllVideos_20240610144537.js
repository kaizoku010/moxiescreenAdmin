import React, { useEffect, useState } from "react";
import VideoCardHolder from "./VideoCardHolder";
import AdList from "./AdList";
import AWS from "aws-sdk";
import "./AllScreens.css";
import { getObjectMetadata } from "../DataLayer/AWSLayer";
import io from 'socket.io-client';

function AllVideos() {
  const [media, setMedia] = useState([]);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const socket = io('http://192.168.124.2:4000'); // Replace with your server IP or domain

  useEffect(() => {
    const fetchMedia = async () => {
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

        // Filter media files
        const mediaObjects = objects.Contents.filter((object) =>
          object.Key.endsWith(".mp4") || object.Key.endsWith(".jpg")
        );

        // Retrieve thumbnails for videos and images
        const mediaList = await Promise.all(
          mediaObjects.map(async (mediaObject) => {
            const mediaKey = mediaObject.Key;
            const mediaType = mediaKey.endsWith(".mp4") ? "video" : "image";
            const [metadata, mediaUrl] = await Promise.all([
              myBucket.headObject({ Bucket: S3_BUCKET, Key: mediaKey }).promise(),
              myBucket.getSignedUrlPromise("getObject", { Bucket: S3_BUCKET, Key: mediaKey }),
            ]);

            const title = metadata.Metadata?.["x-amz-meta-title"];
            const description = metadata.Metadata?.["x-amz-meta-description"];
            const createdAt = metadata.LastModified;
            const size = metadata.ContentLength;

            return {
              mediaKey,
              mediaType,
              title,
              description,
              mediaUrl,
              createdAt,
              size,
            };
          })
        );

        setMedia(mediaList);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    fetchMedia();

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
      <p className="welcome-text">Welcome to your media library {batteryLevel}</p>
      <div>
        <VideoCardHolder />
      </div>
      {media.map((mediaItem) => (
        <AdList
          key={mediaItem.mediaKey}
          title={mediaItem.mediaKey}
          thumb={mediaItem.mediaUrl}
          desc={mediaItem.description}
          type={mediaItem.mediaType}
          date={mediaItem.createdAt}
          size={mediaItem.size}
        />
      ))}
    </div>
  );
}

export default AllVideos;
