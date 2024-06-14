import React, { useState } from 'react'
import "./ScreenHolder.css"
import ScreenImage from "../media/screen_ic.png"

function ScreenHolder({id, btry, status}) {

  
  return (
    <div className='screen-holder'>
    <img src={ScreenImage} className='screen-ic'/>
    <div className='screen-details'>
        <h3 style={{marginBottom:"-1rem"}}>Device ID: {id}</h3>
        <p style={{marginBottom:"-1rem"}}>Battery Level: {btry}%</p>
        <p>Online: <span className='sc-span'>{status}</span></p>

    </div>
    </div>
  )
}

export default ScreenHolder