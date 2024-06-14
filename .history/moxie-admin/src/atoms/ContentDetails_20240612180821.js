import React, { useEffect, useState } from "react";
import "./ContentDetails.css";
import ScreenHolder from "./ScreenHolder";
import VideoListItem from "./VideoListItem";
import ThumbTest from "../media/thumbTest.png"
import BLL from "../media/bll.mp4"
import MoxieMaps from "./MoxieMaps";
import io from 'socket.io-client';


function ContentDetails() {
  const [socketData, setSocketData] = useState([]);
  const [socket_, setSocket] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const socket = io('https://socket-yzb8.onrender.com'); // Ensure you're using the correct URL
    setSocket(socket);


    socket.on('connect', () => {
      console.log('Connected to Socket');

    });


    socket.on('message', (message) => {
      console.log('Received message From RN:', message);
      setSocketData(message);
    });


    socket.on('status', (data) => {
      console.log('Online status:', data);
      setStatus(data);
    });

    socket.on('battery', (data) => {
      console.log('Battery level:', data);
      setBatteryLevel(data);
    });

    socket.on('location', (data) => {
      console.log('Location:', data);
      setLocation(data);
    });


    socket.on('disconnect', () => {
      console.log('Disconnected From WebSocket Server');
    });

    setSocket(socket);

    return () => {
      // socket_.disconnect();
    };  }, []);

  console.log("socket Data: ", status)


const inputMessage = "Hello From Our screen controller";
  const sendMessage = () => {
    if (socket_ && inputMessage.trim()) {
      socket_.emit('message', inputMessage);
      // setInputMessage('');
    }
  };

  sendMessage();

  return (
    <div>
      <p>{socketData}</p>
       <div className="content-details">
      <div className="holder-left">
        <div className="screen-section">
          <ScreenHolder id="MS565TOD" btry="20%" status="Offline" />
          <ScreenHolder id="MS515TNI" btry="30%" status="Offline" />
          <ScreenHolder id="MS525TKX" btry="90%" status="Offline" />
        </div>
        <div className="screen-section">
          <ScreenHolder id="MS1YNAPD" btry="20%" status="Offline" />
          <ScreenHolder id="MS21ZLUS" btry="30%" status="Offline" />
          <ScreenHolder id="MS42IASX" btry="90%" status="Offline" />
        </div>
      </div>
      <div className="list-item"> 
     <video
     className="video"
     loop={true}
     height={"100%"}
      autoPlay={true}
      controls={true}
     src={BLL}/>
      </div>
      
    </div> 
    <MoxieMaps/>
    </div>
  
  );
}

export default ContentDetails;
