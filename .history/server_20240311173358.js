const WebSocket = require('ws');
const express = require('express');

const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log('WebSocket server running on port', PORT);
});

const wss = new WebSocket.Server({ server });

// Set CORS headers for WebSocket connections
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Replace with the origin of your React Native app
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

wss.on('connection', function connection(ws) {
  console.log('WebSocket connection established');

  ws.on('message', function incoming(message) {
    console.log('received:', message.toString());
    // This server only accepts messages, no need to handle them
  });

  ws.on('close', function close() {
    console.log('WebSocket connection closed');
  });
});
