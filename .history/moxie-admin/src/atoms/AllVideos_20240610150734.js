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
      object.Key.endsWith(".mp4") || object.Key.endsWith(".jpg")
    );

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
