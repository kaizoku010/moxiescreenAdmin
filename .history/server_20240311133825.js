const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('WebSocket connection established');

  ws.on('message', function incoming(message) {
    console.log('Received message:', message);
    // Handle incoming messages
  });

  ws.on('close', function close() {
    console.log('WebSocket connection closed');
  });
});
