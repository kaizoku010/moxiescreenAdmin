import React, { useState } from "react";
import "./Sidebar.css";
import { Link, Outlet } from "react-router-dom";
import VideoListItem from "./VideoListItem";
import ThumbTest from "../media/thumbTest.png";
import TestPop from "./TestPop";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div id="sidebar">
        <h1 className="">Moxie 5 Screen Controller</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
          <form>
            <button
              type="submit"
              // onClick={handleOpen}
              data-mdb-modal-init
              data-mdb-target="#exampleModal">
                  Look Up
            </button>
            
          </form>
        </div>
        <div></div>
        <nav>
          <ul>
            <li>
              <a href={`/dashboard`}>DashBoard</a>
            </li>
            <li>
              <a href={`/all-videos`}>All Ads</a>
            </li>
            <li>
              <a href={`/campaigns`}>Create Campaign</a>
            </li>
            <li>
              <a href={`/campaign-list`}>All Campaigns</a>
            </li>
        
            
            <li>
              <a href={`/screen-location`}>Screen Mapping</a>
            </li>
            <li>
              <a href={`/settings`}>Settings</a>
            </li>

            <div className="recentVideos">
              <p className="rv-title">Recently Added Videos</p>
              <VideoListItem img={ThumbTest} />
              <VideoListItem img={ThumbTest} />
              <VideoListItem img={ThumbTest} />
              <VideoListItem img={ThumbTest} />

            </div>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

export default Sidebar;
