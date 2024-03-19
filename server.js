const WebSocket = require('ws');
const express = require('express');
var messageData;
const app = express();
const PORT =  process.env.PORT||8080;
const server = app.listen(PORT, () => {
  console.log('WebSocket server running on port', PORT);
});

const wss = new WebSocket.Server({ server });

// Set CORS headers for WebSocket connections
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'exp://localhost:8081');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});



wss.on('connection', function connection(ws) {
  console.log('WebSocket connection established');

  ws.on('message', function incoming(message) {
    console.log('Received Bundle:', message);
    // This server only accepts messages, no need to handle them
    messageData = message.toString()
    console.log("data variable", messageData);
    sendDataToReactNative(message);
  });

 
  ws.on('close', function close() {
    console.log('WebSocket connection closed');
  });

  // ws.send(JSON.stringify({ message: 'Hello from Emma Moxie 5!' }));

});

const sendDataToReactNative = (message)=>{
wss.clients.forEach((client) => {
  if (client.readyState === WebSocket.OPEN) {
    client.send(message);
  }
});
}


