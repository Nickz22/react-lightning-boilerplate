import React, { useState } from 'react';
import './ProgressBar.css';
const ProgressBar = ( {boxes, action} ) => {
    let updatedState = [];
    // for(let i = 0; i<boxes.length; i++){
    //     if(i > 0 && i % 2 == 0){
    //         updatedState.push(<div className="line-connector"></div>);4
    //     }
    //     updatedState.push(boxes[i]);
    //     if( i == (boxes.length -1))
    //         updatedState.push(getActionInsert());
    // }
    // boxes = updatedState;

    return (
        <div>
        {boxes}
        </div>
    );
    
}

export default ProgressBar;