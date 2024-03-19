import React from 'react'
import React, { useState } from 'react';


function HomeDash() {
    const [message, setMessage] = useState('');

    onst sendMessage = () => {
        // Create a WebSocket connection
        const ws = new WebSocket('ws://localhost:8080');
    
        // Send message to WebSocket server
        ws.onopen = () => {
          ws.send(message);
        };
    
        // Close WebSocket connection
        ws.close();
      };
    
      return (
        <div className="App">
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send Message</button>
        </div>
      );
    };

export default HomeDash