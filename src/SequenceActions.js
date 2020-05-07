import React, { useState } from 'react';
import './SequenceActions.css';
import Box from './Box';
import Modal from './Modal';
import AddAction from './AddAction';
import {doApexAction, log} from './Util';

export default function SequenceActions(){
    /**
     * @description - initial div and input for Sequence Name
     */
    const [state, setState] = useState(
        [
            getInitDiv(''),
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
    
    function setSequenceName(e){
        sequenceName = e.target.value;
        e.target.parentNode.firstChild.textContent = sequenceName;
    }
    /**
     * @description - returns a 'dragger' div used for actions and sequence name
     */
    function getInitDiv(actionLabel){
        return <Box label={actionLabel} handlemousedown={handleMouseDown}/>
    }
    
    

    function showModal(){
        if(modal || !state){
            return;
        }
        getInitialState();
        newState.push(
            <Modal type="Add an Action" selectactiontype={selectActionType} getactions={getActions} oninputkeydown={saveAction}/>
        );
        modal = true;
        setState(newState);
    }

    async function saveAction(label){
        let action = {};
        action["CadenceAction_ID__c"] = document.getElementById('action-results').dataset.selectedrecordid;
        doApexAction('ReactController.saveAction', JSON.stringify(action), results => {
            log('saved ==> '+JSON.stringify(results));
        });
        addAction(label);
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
        doApexAction('ReactController.getActions', actionName, processFetchResults);
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

    

    return (
        <div>
            {state}
        </div>
    );
}