const express = require('express');
const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer');
const mongoose = require('mongoose');
const Video = require('../moxiescreenAdmin/moxie-admin/src/DataLayer/AdModel'); // Assuming you have a Video model
const multerS3 = require('multer-s3')
const aws = require("aws-sdk")
const PORT = process.env.PORT || 8080;

const config = {
  bucketName:"moxiscreen",
  secretAccessKey:"AKIAQ3EGP2YOTF7EHSMS",
  accessKeyId:"ysbQOd0JORlnj7lvMa/oDmI2pRoDxHk38UJH4HX5",
  region:"ap-south-1"

}


aws.config.update({
  secretAccessKey:"AKIAQ3EGP2YOTF7EHSMS",
  accessKeyId:"ysbQOd0JORlnj7lvMa/oDmI2pRoDxHk38UJH4HX5",
  region:"ap-south-1"
})

const app = express();
const s3 = new aws.S3()
// Connect to MongoDB
const uri_ = "mongodb://atlas-sql-6364ec82b0ad221f6390815e-1oyjt.a.query.mongodb.net/ads?ssl=true&authSource=admin";

mongoose.connect(uri_, {
  useNewUrlParser: true,
  socketTimeoutMS:300000,
    useUnifiedTopology: true
});



//AKIAQ3EGP2YOTF7EHSMS access key

//ysbQOd0JORlnj7lvMa/oDmI2pRoDxHk38UJH4HX5 secret key

// const dbRef  = mongoose.model("ads", Video)


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Set up multer storage for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage: storage });
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'moxiescreen',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

// Define route for uploading videos
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    const { description } = req.body;
    const video = new Video({
      description,
      videoPath: req.file.path
    });


    console.log("video recieved: ", description)
      // await dbRef.create({video, description})
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    console.error('Error uploading video backend:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Set CORS headers for WebSocket connections
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

// Start the server
const server = app.listen(PORT, () => {
  console.log('Express server running on port', PORT);
});

// WebSocket functionality
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('WebSocket connection established');

  ws.on('message', function incoming(message) {
    console.log('Received Bundle:', message);
    // This server only accepts messages, no need to handle them
    sendDataToReactNative(message);
  });

  ws.on('close', function close() {
    console.log('Server WebSocket connection closed');
  });

  // ws.send(JSON.stringify({ message: 'Hello from Emma Moxie 5!' }));
});




module .exports = upload