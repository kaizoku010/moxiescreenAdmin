import React, { useState } from 'react';
function HomeDash() {
    const [message, setMessage] = useState('');

    const sendMessage = (value) => {
        // Create a WebSocket connection
        const ws = new WebSocket('ws://192.168.1.19:8081');
        console.log
      
        // When the WebSocket connection is opened
        ws.onopen = () => {
          // Send message to WebSocket server
          ws.send(message.toString());
          console.log("test data", message)
      
          // Close the WebSocket connection after sending the message
          ws.close();
        };
      };
    
      return (
        <div className="App">
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send Message</button>
        </div>
      );
    };

export default HomeDash