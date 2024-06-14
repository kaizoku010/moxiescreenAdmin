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
  const [devic2, setDevic2Data]= useState({})
  const [devic3, setDevic3Data]= useState({})
  const [devic4, setDevic4Data]= useState({})
  const [devic5, setDevic5Data]= useState({})
  const [devic6, setDevic6Data]= useState({})
  const [devic7, setDevic7Data]= useState({})

  useEffect(() => {
    const locationRef = ref(database, 'devices/MX5S001/location');
    const batteryRef = ref(database, 'devices/MX5S001/battery');
    const connectionRef = ref(database, 'devices/MX5S001/status')
    
    
    const locationRef2 = ref(database, 'devices/MX5S002/location');
    const batteryRef2 = ref(database, 'devices/MX5S002/battery');
    const connectionRef2 = ref(database, 'devices/MX5S002/status')

// device one
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

    const unsubscribeStatus = onValue(connectionRef, (snapshot) => {
      const connection = snapshot.val();
      setDeviceData(prevData => ({ ...prevData, connection: connection }));
      console.log("Real-time battery data:", connection);
    });



    // device 2


    const unsubscribeLocation2 = onValue(locationRef, (snapshot) => {
      const locationData = snapshot.val();
      setDevic2Data(prevData => ({ ...prevData, location: locationData }));
      console.log("Real-time location data:", locationData);
    });

    const unsubscribeBattery2 = onValue(batteryRef, (snapshot) => {
      const batteryData = snapshot.val();
      setDeviceData(prevData => ({ ...prevData, battery: batteryData }));
      console.log("Real-time battery data:", batteryData);
    });

    const unsubscribeStatus2 = onValue(connectionRef, (snapshot) => {
      const connection = snapshot.val();
      set(prevData => ({ ...prevData, connection: connection }));
      console.log("Real-time battery data:", connection);
    });


    // Clean up the subscription on unmount
    return () => {
      unsubscribeLocation();
      unsubscribeBattery();
      unsubscribeStatus()
    };
  }, []);

  const { battery, location, connection } = deviceData;

  // console.log("connection: ", connection.online)
  // Function to format battery level
  const formatBatteryLevel = (level) => {
    if (level !== undefined && level !== null) {
      return level.toFixed(2); // Adjust the number in toFixed based on your preference
    }
    return "N/A";
  };

  const batteryLeveled = formatBatteryLevel(battery?.batteryLevel)
  const status = connection?.online;
// console.log("status: " )
  return (
    <div>
      {/* <p>Battery Level: {formatBatteryLevel(battery?.batteryLevel)}%</p>
      <p>Location: {location ? `Lat: ${location.latitude}, Long: ${location.longitude}` : "No location data"}</p> */}
      <div className="content-details">
        <div className="holder-left">
          <div className="screen-section">
            <ScreenHolder id="MXS0001" btry={batteryLeveled} status={status} />
            <ScreenHolder id="MXS0002" btry="30%" status="Offline" />
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
