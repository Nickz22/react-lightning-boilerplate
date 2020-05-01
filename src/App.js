import React, { Component, useState } from 'react';
import ReactDOM from 'react';
import './App.css';

export default function App(){
    const [clicked, setClicked] = useState(false);

    function handleMouseDown(e){
        console.log('mousedown');
        setClicked(true);
        let newDiv = document.createElement('div');
        newDiv.setAttribute('style', 'background-color: white; height: 100px: width: 100px;');
        e.target.append(newDiv);
    }

    function handleMouseUp(){
        console.log('mouseup')
        setClicked(false);
    }

    function handleMouseOut(){
        setClicked(false);
    }

    function handleScroll(e){
        if(clicked){
            e.target.setAttribute('style','top:'+(e.clientY - 40)+'px; left:'+(e.clientX - 40)+'px;');
        }
    }

    return (
        <div className="outer-div">
            <div onMouseDown={handleMouseDown} 
                 onMouseOut={handleMouseOut}
                 onMouseUp={handleMouseUp} 
                 onMouseMove={handleScroll}
                 className="dragger"
                 style={{top: 15, left: 15}}>
            <p className='action-label'>Email</p>
            </div>
        </div>
    );
}