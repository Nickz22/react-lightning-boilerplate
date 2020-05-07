import React from 'react';

const PlusSign = ({onclick}) => {
    return (
    <svg width="25" 
         height="25" onClick={onclick}>
        <circle cx="12" cy="12" r="12"
                fill="rgb(131,197,82)"/>
        <rect width="2" 
                height="12" 
                style={{fill: "rgb(255,255,255)",
                x: 10,
                y: 5,
                rx:1, 
                ry:1,
                strokeLinecap:"round"}}/>
        <rect width="12" 
              height="2"        
              style={{fill: "rgb(255,255,255)",
              y: 10,
              x: 5,
              rx:1, 
              ry:1,
              strokeLinecap:"round"}}/>
    </svg>
    );
};

export default PlusSign;