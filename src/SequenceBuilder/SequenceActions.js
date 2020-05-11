import React, { useState } from 'react';
import ActionModal from '../ActionModal';
import {doApexAction, log} from '../Util/Util.js';
import './SequenceActions.css';

export default function SequenceActions({viewMap}){
    log('SequenceAction view map ==> '+JSON.stringify(viewMap));
    const [states, setState] = useState(
        [
            <ActionModal viewMap={viewMap} />
        ]
    );

    return (
        <div>
            {states}
        </div>
    );

    // function getModal(){
    //     // log('returning modal')    ;
    //     if(states!=undefined && states){
    //         this.refs.child.setName();
    //     }
    // }

    // function bubble(event){
    //     viewMap["saveaction"](event);
    // }

    // function selectActionType(e){
    //     log('selected action type ==> '+e.target.textContent);
    // }

    // function handleMouseDown(){
    //     click = true;
    // }

    // function handleMouseUp(){
    //     click = false;
    // }

    //     function handleMouseOut(){
    //     click = false;
    // }

    // function handleScroll(e){
    //     if(click){
    //         e.target.setAttribute('style','top:'+(e.clientY - 40)+'px; left:'+(e.clientX - 40)+'px;');
    //     }
    // }
}