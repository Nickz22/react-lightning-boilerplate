import React, { useState } from 'react';
import SequenceActions from './SequenceActions';
import SequenceCriteria from './SequenceCriteria';
import SequenceDetail from './SequenceDetail';
import ProgressBar from './ProgressBar';
import Box from './Box';
import AddAction from './AddAction';
import {log} from './Util.js';
import './App.css';

export default function App(){
    let sequenceSteps = [];
    let step = 0;
    const [view, setView] = useState([
        getUpdatedView(step, [])
    ]);
    function getUpdatedView(){
        let viewMap = {
            0 : <div></div>,
            1 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="sequence-detail"><SequenceDetail ondone={closeModal} /></div>],
            2 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="criteria-entry" className="show"><SequenceCriteria type="Entry Criteria" ondone={closeModal}/></div>],
            3 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="criteria-exit"><SequenceCriteria type="Exit Criteria" ondone={closeModal}/></div>],
            4 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="sequence-action" className="show"><SequenceActions ondone={closeModal} /></div>]
        }
        return viewMap[step > 4 ? 4 : step];
    }

    function setUpdatedState(){
        if(step > 4){
            document.getElementById("sequence-action").className="show";
        }
        setView(getUpdatedView());
    }

    function closeModal(event){
        log('incoming type ==> '+event["type"]);
        if(event["type"].toLowerCase().includes('detail')){
            document.getElementById("sequence-detail").className="hide";
        }
        if(event["type"].toLowerCase().includes('criteria')){
            if(document.getElementById("criteria-entry"))
                document.getElementById("criteria-entry").className="hide";
            if(document.getElementById("criteria-exit"))
                document.getElementById("criteria-exit").className="hide";
        }
        if(event["type"].toLowerCase().includes('exit')){
            log('exit');
            document.getElementById("criteria-exit").className="hide";
        }
        if(event["type"].toLowerCase().includes('action')){
            document.getElementById("sequence-action").className="hide";
        }
        showNextStep(event["name"]);
    }
    function showNextStep(label){
        if( document.getElementsByTagName("button").length > 0 ){
            step++;
            document.getElementsByTagName("button")[0].remove();
            setView(getUpdatedView());
        }else if( label && label.length > 0 && sequenceSteps.length <= 1 ){
            sequenceSteps.push(<Box label={label} onclick={bubbleLabel} />);
            sequenceSteps.push(getActionInsert());
            setView(getUpdatedView());
            step++;
        }else{
            let actionInsert = sequenceSteps.pop();
            sequenceSteps.push(<div className="line-connector"></div>);
            sequenceSteps.push(<Box label={label} onClick={bubbleLabel} />);
            sequenceSteps.push(actionInsert);
            setView(getUpdatedView());
            step++;
        }
    }   
    function bubbleLabel(label){
        log('label received ==> '+label);
    }

    /**
     * @description - returns connector and "+" sign
     */
    function getActionInsert(){
        return <AddAction onaddaction={addAction}/>
    }

    /**
     * @description - adds div for new action in second to last index of state array
     */
    function addAction(){
        setUpdatedState();
    }
    /**
     * @description will need when user saves the sequence
     * @param {String} label 
     */
    async function saveAction(label){
        let action = {};
        action["CadenceAction_ID__c"] = document.getElementById('action-results').dataset.selectedrecordid;
        doApexAction('ReactController.saveAction', JSON.stringify(action), results => {
            log('saved ==> '+JSON.stringify(results));
        });
        addAction(label);
    }
    return (
        <div className="outer-div">
            <button onClick={() => showNextStep('')} style={{position: "absolute", left: "25%", top: "25%"}}>+ Start Here</button>
            {view}
        </div>
    );
}