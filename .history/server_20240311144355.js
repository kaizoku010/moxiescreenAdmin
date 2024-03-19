const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('WebSocket connection established');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message.toString());
    // Handle incoming messages
    ws.send(message);
  });

  ws.on('close', function close() {
    console.log('WebSocket connection closed');
  });
});
