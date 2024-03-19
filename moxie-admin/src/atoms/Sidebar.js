import React from "react";
import "./Sidebar.css";
import { Outlet } from "react-router-dom";
import VideoListItem from "./VideoListItem";
import ThumbTest from "../media/thumbTest.png";

function Sidebar() {
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
          <form method="post">
            <button
              type="submit"
              data-mdb-modal-init
              data-mdb-target="#exampleModal"
            >
              Add Video
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
              <a href={`/all-screens`}>All Screens</a>
            </li>
            <li>
              <a href={`/all-videos`}>All Videos</a>
            </li>
            <li>
              <a href={`/screen-location`}>Screen Location</a>
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
