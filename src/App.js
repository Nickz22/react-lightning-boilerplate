import React, { Component, useState } from 'react';

import './App.css';

export default function App(){
    /**
     * @description - initial div and input for Sequence Name
     */
    const [state, setState] = useState(
        [
            getInitDiv('', 50, '50%'),
            getActionInsert(100),
            <input type="text" id="foo" onKeyUp={setSequenceName} />
        ]
    );
    /**
     * @description - using newState for state management, {state} will always be set with newState value
     *                  I couldn't figure out how to directly use {state} for this.
     */
    let newState = [];
    /**
     * @description - if {clicked} is true, target will move vertically
     */
    // const [clicked, setClicked] = useState(false);
    /**
     * @description - if true, target will drag vertically
     */
    let click = false;

    let modal = false;
    let sequenceName = '';
    
    function getConnector(top, left){
        return <div className="line-connector"></div>;
    }
    function setSequenceName(e){
        sequenceName = e.target.value;
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
            if( !modal ){
                newState.push(<div style={{
                    position: "fixed", 
                    top: "10%", 
                    left:"50%",
                    backgroundColor: "white", 
                    height: 400, 
                    width: 275,
                    borderRadius: "5%",
                    boxShadow: "0 0 2.5px rgb(206, 206, 206)",
                    padding: 15
                }}>
                    <p>Add an Action</p>
                    <div className="action-types">
                        <p className="type-header" style={{
                            marginTop: "-5px"
                        }}>Type Action</p>
                        <div className="types">
                            <p className="type">Call</p>
                            <p className="type">Email</p>
                            <p className="type">SMS</p>
                            <p className="type">Task</p>
                        </div>
                        <form>
                            <div>
                                <label>Select Action <br />
                                    <input type="text" name="action"/>
                                </label>
                            </div>
                            <div>
                                <label>Execution Time <br />
                                    <input type="text" name="time"/>
                                </label>
                            </div>
                            <div>
                                <label>Field Updates <br />
                                    <input type="radio"/>  No Field Updates<br/>
                                    <input type="radio"/>  Field Updates Required<br/>
                                </label>
                            </div>
                            <div>
                                <label>Criteria <br />
                                    <input type="radio"/>  No Additional Criteria<br/>
                                    <input type="radio"/>  Conditions are met<br/>
                                </label>
                            </div>
                            <div style={{display: "flex", height: "40px", width: "70px"}}>
                                <button type="reset" style={{border: "none", borderRadius: "2%"}}><p style={{color: "grey", fontSize: "10px"}}>Cancel</p></button>
                                <button type="submit" style={{backgroundColor: "lightgreen",borderRadius: "2%"}}><p style={{fontSize: "10px"}}>Save</p></button>
                            </div>
                        </form>
                    </div>
                </div> );
                modal = true;
            }
            setState(newState);
        }else{
            let newnewState = [];
            for( let i = 0; i<newState.length; i++ ){
                if(newState[i]["props"]["id"]=='add-action'){
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
        // setClicked(true);
        click = true;
    }

    function handleMouseUp(){
        // setClicked(false);
        click = false;
    }

        function handleMouseOut(){
        // setClicked(false);
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