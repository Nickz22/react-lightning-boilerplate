import React, { useState } from 'react';
import ActionModal from '../ActionModal';
import {doApexAction, log} from '../Util/Util.js';
import './SequenceAction.css';

export default function SequenceAction({viewMap}){
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
/**
 * will need when implementing draggable steps
 *
 * function handleMouseDown(){
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
 */
}
