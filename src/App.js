import React, { Component, useState } from 'react';
import ReactDOM from 'react';
import './App.css';

export default function App(){

    function getInitDiv(actionLabel, top){
        return <div onMouseDown={handleMouseDown} 
                    className="dragger action-label"
                    style={{top: top, left: 15}}
                    id="dont-drag">
                    {actionLabel}
                </div>
    }
    const [state, setState] = useState(
        [
            getInitDiv('Native Email', 15),
            getInitDiv('SFDC Email', 115),
            getInitDiv('Call', 225),
            getInitDiv('SMS', 325),
            getInitDiv('Task', 425),
        ]
    );
    const [clicked, setClicked] = useState(false);
    let click = false;

    function handleMouseDown(e){
        console.log('mousedown');
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