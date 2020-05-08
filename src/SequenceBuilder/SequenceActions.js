import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import {doApexAction, log} from '../Util/Util.js';
import './SequenceActions.css';

export default function SequenceActions({id, ondone}){
    const [state, setState] = useState(
        [
            <Modal type="Add an Action" select={selectActionType} saveaction={bubble}/>
        ]
    );

    function bubble(event){
        console.log('bubble');
        event["id"] = id;
        ondone(event);
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