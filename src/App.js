import React, { Component, useState } from 'react';
import './App.css';
import Box from './Box';
import Modal from './Modal';
import AddAction from './AddAction';
import doApexAction from './Util';

export default function App(){
    /**
     * @description - initial div and input for Sequence Name
     */
    const [state, setState] = useState(
        [
            getInitDiv('', 50, '50%'),
            getActionInsert(),
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
        return <Box label={actionLabel} handlemousedown={handleMouseDown}/>
    }
    /**
     * @description - returns connector and "+" sign
     */
    function getActionInsert(){
        return <AddAction id="add-action" addaction={addAction}/>
    }
    /**
     * @description - adds div for new action in second to last index of state array
     */
    function addAction(){
        if( newState.length == 0 ){
            getInitialState();
            showModal(modal);
            setState(newState);
        }else{  
            newState = getUpdatedState();
            setState(newState);
        }
    }

    function getInitialState(){
        for( var i = 0; i<state.length; i++ ){
            if(state[i]["props"]["id"]=='add-action'){
                newState.push(getConnector(100, '63%'));
                newState.push(getInitDiv('Action Instance', 50+(65*i), '50%'));
                newState.push(getActionInsert());
            }else if(state[i]["props"]["id"]!='foo'){ // dont add text input to new state
                newState.push(state[i]);           
            }
        }
    }

    function getUpdatedState(){
        let newnewState = [];
        for( let i = 0; i<newState.length; i++ ){
            if(newState[i]["props"]["id"]=='add-action'){
                newnewState.push(getConnector((56 * i), '63%'));
                newnewState.push(getInitDiv('Action Instance', (58*i), '50%'));
                newnewState.push(getActionInsert());
            }else{
                newnewState.push(newState[i]);
            }
        }
        return newnewState;
    }

    function showModal(modal){
        if(modal){
            return;
        }
        newState.push(
            <Modal selectactiontype={selectActionType} getactions={getActions} saveaction={saveAction}/>
        );
        modal = true;
    }

    function saveAction(){
        let action = {};
        action["CadenceAction_ID__c"] = document.getElementById('action-results').dataset.selectedrecordid;
        Visualforce.remoting.Manager.invokeAction(
            'ReactController.saveAction',
            JSON.stringify(action),
            (results, event) => {
                if(event.status){
                    console.log('saved successfully '+results[0]);
                }
            }
        );
    }

    function handleActionClick(e){
        let input = document.getElementById('action_input');
        input.value = e.target.textContent;
        let i = document.getElementById('action-results');
        i.dataset.selectedrecordid = e.target.dataset.recordid;
        disperseActions();
    }

    function disperseActions(){
        let resultsToDisperse = document.querySelectorAll(".action-name");
        if(resultsToDisperse && resultsToDisperse.length > 0){
            for( let x = 0; x < resultsToDisperse.length; x++){
                resultsToDisperse[x].remove();
            }
        }
    }

    function getActions(e){
        if(e.target.value.length > 2){
            disperseActions();
            fetchActions(e.target.value);
        }
    }

    function processFetchResults(results){
        console.log('callback');
        let viewResults = document.getElementById("action-results");
        for(let i = 0 ; i<results.length; i++){
            let p = document.createElement("P");
            let textNode = document.createTextNode(results[i]["Name"]);
            p.appendChild(textNode);
            p.className='action-name';
            p.dataset.recordid=results[i]["Id"];
            p.addEventListener("click", handleActionClick);
            viewResults.appendChild(p);
        }
    }

    async function fetchActions (actionName){
        let result = await doApexAction('ReactController.getActions', actionName, processFetchResults);
        // let result = await doApexAction();
        log('result ==> '+result);
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