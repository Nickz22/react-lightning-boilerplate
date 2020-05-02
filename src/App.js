import React, { Component, useState } from 'react';
import ReactDOM from 'react';
import './App.css';

export default function App(){

    const [state, setState] = useState(
        [
            getInitDiv('', 50, '50%'),
            getActionInsert(100),
            <input type="text" id="foo" onKeyUp={setSequenceName} />
        ]
    );
    let newState = [];
    const [clicked, setClicked] = useState(false);
    let click = false;
    let sequenceName = '';
    
    function getConnector(top, left){
        // return <div style={{top: top, left: left}} className="line-connector"></div>;
        return <div className="line-connector"></div>;
    }
    function setSequenceName(e){
        sequenceName = e.target.value;
        log('name ==> '+sequenceName);
        e.target.parentNode.firstChild.textContent = e.target.value;
    }
    function getInitDiv(actionLabel, top, left){
        return <div onMouseDown={handleMouseDown} 
                    className="dragger"
                    onMouseUp={handleMouseUp}
                    onMouseOut={handleMouseOut}
                    onMouseMove={handleScroll}
                    id="dont-drag">
                    <p className="action-label">{actionLabel}</p>
                </div>
    }

    function getActionInsert(top){
        let left = '60.75%';
        // return  <div style={{top: top, left: left, position: "absolute", display: 'block'}}>
        return  <div id="add-action" style={{display: 'block'}}>
        <div className="new-action-connector"></div> 
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
        let checkProp = false;
        let input = document.getElementsByTagName('input');
        log('input size ==> '+input.length);
        // input[0].remove();
        if( newState.length == 0 ){
            for( var i = 0; i<state.length; i++ ){
                if(state[i]["props"]["id"]=='add-action'){
                    newState.push(getConnector(100, '63%'));
                    newState.push(getInitDiv('Action Instance', 50+(65*i), '50%'));
                    newState.push(getActionInsert((i*65)+100));
                    newState.remove((newState.length -1));
                }else if(state[i]["props"]["id"]!='foo'){ // dont add text input to new state
                    newState.push(state[i]);           
                }
            }
            setState(newState);
        }else{
            let newnewState = [];
            for( let i = 0; i<newState.length; i++ ){
                if(i == newState.length - 1){
                    newnewState.push(getConnector((56 * i), '63%'));
                    newnewState.push(getInitDiv('Action Instance', (58*i), '50%'));
                    newnewState.push(getActionInsert((i*60)));
                }else{
                    newnewState.push(newState[i]);
                }
            }
            newState = newnewState;
            setState(newnewState);
        }
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