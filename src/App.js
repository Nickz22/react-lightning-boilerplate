import React, { Component, useState } from 'react';
import ReactDOM from 'react';
import './App.css';

export default function App(){

    const [state, setState] = useState(
        [
            getInitDiv('Sequence Name', 50, '50%'),
            getActionInsert(100)
        ]
    );
    let newState = [];
    const [clicked, setClicked] = useState(false);
    let click = false;

    function getConnector(){
        return <div className="line-connector"></div>;
    }

    function getInitDiv(actionLabel, top, left){
        return <div onMouseDown={handleMouseDown} 
                    className="dragger"
                    onMouseUp={handleMouseUp}
                    onMouseOut={handleMouseOut}
                    onMouseMove={handleScroll}
                    style={{top: top, left: left}}
                    id="dont-drag">
                    <p className="action-label">{actionLabel}</p>
                </div>
    }

    function getActionInsert(top){
        let left = '60.75%';
        return  <div style={{top: top, left: left, position: "absolute", display: 'block'}}>
        <div className="line-connector"></div> 
        <div className="add-action" onClick={addAction}>
            <svg width="25" height="25">
                <circle cx="12" cy="12" r="12"
                        fill="rgb(131,197,82)"/>
                <rect width="2" 
                        height="12" 
                        style={{fill: "rgb(255,255,255)",
                        x: 10,
                        y: 5,
                        rx:1, ry:1,
                        strokeLinecap:"round"}}/>
                <rect width="12" 
                        height="2"        
                    style={{fill: "rgb(255,255,255)",
                        y: 10,
                        x: 5,rx:1, ry:1,
                        strokeLinecap:"round"}}/>
            </svg>
        </div>
                </div> 
    }
    
    function addAction(e){
        if( newState.length == 0 ){
            log('state length 1 ==> '+state.length);
            for( let i = 0; i<state.length; i++ ){
                if(i == state.length - 1){
                    newState.push(getConnector());
                    newState.push(getInitDiv('Action Instance', 50+(65*i), '50%'));
                    newState.push(getActionInsert((i*65)+100));
                }else{
                    newState.push(state[i]);
                }
            }
            log('newState length ==> '+newState.length);
            setState(newState);
            log('state length 2 ==> '+state.length);
        }else{
            log('new state length 1 ==> '+newState.length);
            let newnewState = [];
            for( let i = 0; i<newState.length; i++ ){
                if(i == newState.length - 1){
                    newnewState.push(getConnector());
                    newnewState.push(getInitDiv('Action Instance', 50+(65*i), '50%'));
                    newnewState.push(getActionInsert((i*65)+100));
                }else{
                    newnewState.push(newState[i]);
                }
            }
            newState = newnewState;
            log('newnewstate length ==> '+newnewState.length);
            setState(newnewState);
            log('new state length 2 ==> '+newState.length);
        }
        
        // let n = React.createElement('div', {}, null);
        // e.target.parentNode.insertBefore(getInitDiv('Action Instance', '30%', '50%'), null);
        // setClicked(true);
    }
    function handleMouseDown(){
        setClicked(true);
        click = true;
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

    function log(message){
        console.log(message);
    }

    return (
        <div className="outer-div">
            {state}
        </div>
    );
}