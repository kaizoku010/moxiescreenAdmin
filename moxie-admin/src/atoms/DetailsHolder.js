import React from 'react'
import "./DetailsHolder.css"

function DetailsHolder({title, numbers, action}) {
  return (
    <div className='details-holder'>
        <p className='tvp'>{title}</p>
           <div className='tvp-lower-details'>
            <h2 className='numbers'>{numbers}</h2>
            <p className='actions'>{action}</p>
            </div> 
    </div>
  )
}

export default DetailsHolder