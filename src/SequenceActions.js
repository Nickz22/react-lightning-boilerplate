import React, { useState } from 'react';
import Modal from './Modal';
import {doApexAction, log} from './Util.js';
import './SequenceActions.css';

export default function SequenceActions({ondone}){
    const [state, setState] = useState(
        [
            <Modal type="Add an Action" select={selectActionType} oninputkeydown={getActions} saveaction={ondone}/>
        ]
    );

    function getActions(e){
        if(e.target.value.length > 2){
            disperseActions();
            fetchActions(e.target.value);
        }
    }
    function fetchActions (actionName){
        doApexAction('ReactController.getActions', actionName, processFetchResults);
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

    function selectActionType(e){
        log('selected action type ==> '+e.target.textContent);
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