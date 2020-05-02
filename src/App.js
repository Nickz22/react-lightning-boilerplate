import React, { Component, useState } from 'react';
import ReactDOM from 'react';
import './App.css';

export default function App(){

    function getConnector(){
        return <div className="line-connector"></div>
    }

    function getInitDiv(actionLabel, top, left){
        return <div onMouseDown={handleMouseDown} 
                    className="dragger"
                    style={{top: top, left: left}}
                    id="dont-drag">
                    <p className="action-label">{actionLabel}</p>
                </div>
    }

    function getActionInsert(){
        let top = '22.5%';
        let left = '60.75%';
        return  <div style={{top: top, left: left, position: "absolute"}}>
                    <svg width="200" height="100">
                        <circle cx="12" cy="12" r="12"
                                fill="rgb(131,197,82)"/>
                        <rect width="2" 
                              height="12" 
                              style={{fill: "rgb(255,255,255)",
                              x: 10,
                              y: 5,
                              strokeLinecap:"round"}}/>
                        <rect width="12" 
                              height="2" 
                              style={{fill: "rgb(255,255,255)",
                              y: 10,
                              x: 5,
                              strokeLinecap:"round"}}/>
                    </svg>
                </div> 
    }

    const [state, setState] = useState(
        [
            getInitDiv('Sequence Name', '10%', '50%'),
            getConnector(), 
            getActionInsert()
        ]
    );
    const [clicked, setClicked] = useState(false);
    let click = false;

    function handleMouseDown(e){
        setClicked(true);
        click = true;
        if(e.target.id == 'dont-drag'){
            let newState = state;
            newState.push(
                <div style={{top: 400, left: 400}} 
                    className="dragger action-label"
                    onMouseOut={handleMouseOut}
                    onMouseUp={handleMouseUp} 
                    onMouseMove={handleScroll}
                    onMouseDown={handleMouseDown} >
                        Action Instance
                </div>
            );
        }
    }

    function handleMouseUp(){
        console.log('mouseup')
        setClicked(false);
        click = false;
    }

    function handleMouseOut(){
        setClicked(false);
        click = false;
    }

    function handleScroll(e){
        console.log('clicked? '+click);
        if(click){
            e.target.setAttribute('style','top:'+(e.clientY - 40)+'px; left:'+(e.clientX - 40)+'px;');
        }
    }

    return (
        <div className="outer-div">
            {state}
        </div>
    );
}