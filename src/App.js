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
    /**
     * @description - if true, target will drag vertically
     */
    let click = false;
    /**
     * @description - flag to indicate that the Add Action modal is open
     */
    let modal = false;
    let sequenceName = '';
    let selectedActionType = '';
    /**
     * @description - line connector between two elements
     */
    function getConnector(top, left){
        return <div className="line-connector"></div>;
    }
    function setSequenceName(e){
        sequenceName = e.target.value;
        e.target.parentNode.firstChild.textContent = sequenceName;
    }
    /**
     * @description - returns a 'dragger' div used for actions and sequence name
     */
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
    /**
     * @description - returns connector and "+" sign
     */
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
    /**
     * @description - adds div for new action in second to last index of state array
     */
    function addAction(){
        if( newState.length == 0 ){
            for( var i = 0; i<state.length; i++ ){
                if(state[i]["props"]["id"]=='add-action'){
                    newState.push(getConnector(100, '63%'));
                    newState.push(getInitDiv('Action Instance', 50+(65*i), '50%'));
                    newState.push(getActionInsert((i*65)+100));
                    // newState.remove((newState.length -1));
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
                    borderRadius: "2%",
                    boxShadow: "0 0 2.5px rgb(206, 206, 206)",
                    padding: 15,
                    overflow: "scroll"
                }}>
                    <p>Add an Action</p>
                    <div className="action-types">
                        <p className="type-header" style={{
                            marginTop: "-5px"
                        }}>Type Action</p>
                        <div className="types">
                            <p className="type" onClick={selectActionType}>Call</p>
                            <p className="type" onClick={selectActionType}>Email</p>
                            <p className="type" onClick={selectActionType}>SMS</p>
                            <p className="type" onClick={selectActionType}>Task</p>
                        </div>
                        <form>
                            <div>
                                <label>Select Action <br />
                                    <input type="text" onFocus={getActions} name="action" id="action_input"/>
                                    <div id="action-results" className="action-result-panel"></div>
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

    function handleActionClick(e){
        log('running');
        log(e.target.textContent);
        let i = document.getElementById('action_input');
        i.value = e.target.textContent;

        let resultsToDisperse = document.querySelectorAll(".action-name");
        log('dispersing '+resultsToDisperse.length);
        for( let x = 0; x < resultsToDisperse.length; x++){
            resultsToDisperse[x].remove();
        }
    }

    function getActions(e){
        if(e.target.value.length > 2){
            log('running');
            fetchActions(e.target.value);
        }
    }

    function fetchActions(actionName){
        Visualforce.remoting.Manager.invokeAction(
            'ReactController.getActions',
            actionName,
            (results, event) => {
                if(event.status){
                    console.log('callback');
                    let viewResults = document.getElementById("action-results");
                    for(let i = 0 ; i<results.length; i++){
                        let p = document.createElement("P");
                        let textNode = document.createTextNode('Name: '+results[i]["Name"]);
                        p.appendChild(textNode);
                        p.className='action-name';
                        p.addEventListener("click", handleActionClick);
                        viewResults.appendChild(p);
                    }
                }
            }
        );
    }

    function selectActionType(e){
        selectedActionType = e.target.textContent;
    }

    function handleMouseDown(){
        click = true;
    }

    function handleMouseUp(){
        click = false;
    }

        function handleMouseOut(){
        click = false;
    }

    function handleScroll(e){
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