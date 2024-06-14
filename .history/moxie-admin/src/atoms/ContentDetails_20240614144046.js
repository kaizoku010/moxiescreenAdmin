import React, { useEffect, useState } from "react";
import { database, ref, onValue } from "./firebaseConfig";
import "./ContentDetails.css";
import ScreenHolder from "./ScreenHolder";
import VideoListItem from "./VideoListItem";
import ThumbTest from "../media/thumbTest.png";
import BLL from "../media/bll.mp4";
import MoxieMaps from "./MoxieMaps";

function ContentDetails() {
  const [deviceData, setDeviceData] = useState({});

  useEffect(() => {
    const locationRef = ref(database, 'devices/MX5S001/location');
    const batteryRef = ref(database, 'devices/MX5S001/battery');

    const unsubscribeLocation = onValue(locationRef, (snapshot) => {
      const locationData = snapshot.val();
      setDeviceData(prevData => ({ ...prevData, location: locationData }));
      console.log("Real-time location data:", locationData);
    });

    const unsubscribeBattery = onValue(batteryRef, (snapshot) => {
      const batteryData = snapshot.val();
      setDeviceData(prevData => ({ ...prevData, battery: batteryData }));
      console.log("Real-time battery data:", batteryData);
    });

    // Clean up the subscription on unmount
    return () => {
      unsubscribeLocation();
      unsubscribeBattery();
    };
  }, []);

  const { battery, location } = deviceData;

  // Function to format battery level
  const formatBatteryLevel = (level) => {
    if (level !== undefined && level !== null) {
      return level.toFixed(2); // Adjust the number in toFixed based on your preference
    }
    return "N/A";
  };

  const batteryLeveled = ""


  return (
    <div>
      <p>Battery Level: {formatBatteryLevel(battery?.batteryLevel)}%</p>
      <p>Location: {location ? `Lat: ${location.latitude}, Long: ${location.longitude}` : "No location data"}</p>
      <div className="content-details">
        <div className="holder-left">
          <div className="screen-section">
            <ScreenHolder id="MXS0001" btry="40%" status="Offline" />
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
            src={BLL}
          />
        </div>
      </div>
      <MoxieMaps />
    </div>
  );
}

export default ContentDetails;
