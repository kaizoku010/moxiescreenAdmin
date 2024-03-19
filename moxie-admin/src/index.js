import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Sidebar from './atoms/Sidebar';
import HomeDash from './atoms/HomeDash';
import Login from './atoms/Login';

const Root = createBrowserRouter([

  {
    path:"/login",
    element:<Login/>
  },

{
  path:"/",
  element:<Sidebar/>,
  // this is how u render dashboards
  children:[
 {
  path:"/dashboard",
  element:<HomeDash/>
},
{
  path:"/all-screens",
  element:"All Screens"
},
{
  path:"/all-videos",
  element:"All Videos"
},
{
  path:"/screen-location",
  element:"Screen Location"
},
{
  path:"/settings",
  element:"Settings"
},
  ]
},

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
<RouterProvider router={Root}/>
  </React.StrictMode>
);

reportWebVitals();
