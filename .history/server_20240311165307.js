const WebSocket = require('ws');
const express = require('express');

const app = express();
const server = app.listen(8080, () => {
  console.log('WebSocket server running on port 8080');
});

const wss = new WebSocket.Server({ noServer: true });

ws.on('connection', function connection(ws) {
  console.log('WebSocket connection established');

  ws.on('message', function incoming(message) {
    console.log('received:', message.toString());
    // Handle incoming messages
    // Example: You can broadcast the message to all connected clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      
    });
  });

  ws.on('close', function close() {
    console.log('WebSocket connection closed');
  });
});

// Set CORS headers for WebSocket connections
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with the origin of your React Native app
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
