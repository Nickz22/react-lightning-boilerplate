import React, { useState } from 'react';
import SequenceAction from './SequenceAction';
import SequenceEntryCriteria from './SequenceEntryCriteria';
import SequenceExitCriteria from './SequenceExitCriteria';
import SequenceDetail from './SequenceDetail';
import ProgressBar from '../ProgressBar/ProgressBar';
import Box from '../Box/Box';
import AddAction from '../AddAction/AddAction';
import {log, getStepMap} from '../Util/Util.js';
import './SequenceBuilder.css';

export default function App(){
    let sequenceSteps = []; // contains divs for all steps including sequence detail, criteria, actions and connectors
    let actionModalContent = {
        "saveaction" : closeModal,
        "info": {
            "name": "",
            "id": ""
        }
    };
    let modalContent = {
        "saveaction" : closeModal,
        "onTypeSelect" : type => {log('got type: '+type)},
        "info" : {
            "name" : "",
            "id" : "",
            "type": "Sequence Detail"
        }
    }
    let step = 0;
    let actionInput;
    let nonActionInput;
    const [view, setView] = useState([
        getUpdatedView(step)
    ]);
    /**
     * @description uses key value pairs to retrieve the requested rerender view
     * @param {Integer} index - key of view to rerender
     */
    function getUpdatedView(index){
        let viewMap = {
            0 : <div></div>,
            1 : [<ProgressBar boxes={sequenceSteps} />,<div id="modal-container"><SequenceDetail viewMap={modalContent} /></div>],
            2 : [<ProgressBar boxes={sequenceSteps} />,<div id="modal-container" className="show"><SequenceEntryCriteria viewMap={modalContent}/></div>],
            3 : [<ProgressBar boxes={sequenceSteps} />,<div id="modal-container"><SequenceExitCriteria viewMap={modalContent}/></div>],
            4 : [<ProgressBar boxes={sequenceSteps} />,<div id="modal-container" className="show"><SequenceAction viewMap={actionModalContent} /></div>]
        }
        return viewMap[index > 4 ? 4 : index];
    }

    /**
     * @description handles modal saved state to either update an existing step or add a new step
     * @param {Object} event - bubbled from modal which was saved
     */
    function closeModal(event){
        if( event["info"] && event["info"]["element"] ){
            if( event["info"]["id"] < 4 && !nonActionInput){
                nonActionInput = event["info"]["element"];
            }else{
                actionInput = event["info"]["element"];
            }
        }
        document.getElementById("modal-container").className="hide";
        if(!stepExists(event)){
            addNextStep(event);
        }
    }
    /**
     * 
     * @param {Object} event adds new step to bottom of step list, before add action div
     */
    function addNextStep(event){
        if( document.getElementsByTagName("button").length > 0 ){ // handle "Start Here" click
            showSequenceDetailModal();
        }else if( sequenceSteps.length <= 1 ){ // init ProgressBar with first step and add action div
            addSequenceDetailStep(event);
        }else{
            addStep(event); 
        }
    }
    /**
     * @description adds new non-sequence detail step to bottom of step list, before add action div
     * @param {Object} event - bubbled from modal click
     */
    function addStep(event){
        let id = parseInt(event["info"]["id"]);
        let actionInsert = sequenceSteps.pop();
        sequenceSteps.push(<div className="line-connector" id={(id - .5)}></div>);
        sequenceSteps.push(<Box label={event["info"]["name"]} type={event["info"]["type"]} onclick={showModal} id={id} />);
        sequenceSteps.push(actionInsert);
        setView(getUpdatedView(id));
        step++;
    }
    /**
     * @description checks if bubbled state is associated with existing step or new step
     * @param {Object} event - bubbled from modal click
     */
    function stepExists(event){
        let id = parseInt(event["info"]["id"]);
        let stepExists = false;
        let boxMap = getStepMap(sequenceSteps);
        if( boxMap.has(id) ){
            boxMap.delete(1000); // remove add action div
            boxMap.set(id, <Box id={id} label={event["info"]["name"]} type={event["info"]["type"]} onclick={showModal} />);
            let orderedMap = new Map([...boxMap.entries()].sort());
            sequenceSteps = Array.from(orderedMap.values());
            sequenceSteps.push(getActionInsert()); // replace add action div
            setView(getUpdatedView(id));
            stepExists = true;
        }
        return stepExists;
    }
    /**
     * @description show modal to add first step, which will always be the sequence detail step
     */
    function showSequenceDetailModal(){
        step++;
        document.getElementsByTagName("button")[0].remove();
        setView(getUpdatedView(step));
    }
    /**
     * @description handles addition of first new step, which will always be the sequence detail step
     * @param {Object} event - bubbled by SequenceDetail on modal save
     */
    function addSequenceDetailStep(event){
        sequenceSteps.push(<Box type={event["info"]["type"]} label={event["info"]["name"]} onclick={showModal} id={step} />);
        sequenceSteps.push(getActionInsert());
        setView(getUpdatedView(step));
        step++;
    }
    /**
     * @description show modal to edit step when the corresponding div step is clicked
     * @param {Object} event - bubbled by div step onclick
     */
    function showModal(event){
        let id = parseInt(event["info"]["id"]);
        actionModalContent["info"]["id"] = id;
        document.getElementById("modal-container").className = "show";
        let boxMap = getStepMap(sequenceSteps);
        if(boxMap.has(id) && id>=4 && actionInput){
            actionInput.value = event["info"]["name"];
        }else if(boxMap.has(id) && id<4 && nonActionInput){
            modalContent["info"]["name"] = event["info"]["name"];
            modalContent["info"]["type"] = event["info"]["type"];
            modalContent["info"]["id"] = event["info"]["id"];
            nonActionInput.value = event["info"]["name"];
        }
        setView(getUpdatedView(id));
    }
    /**
     * @description return add step element
     */
    function getActionInsert(){
        return <AddAction onaddaction={addAction} id={1000}/>
    }
    /**
     * @description reveal modal to let user add a new step
     */
    function addAction(){
        switch(step){
            case 1:
                modalContent["info"]["type"] = "Sequence Detail";
                modalContent["info"]["id"] = step;
                break;
            case 2: 
                modalContent["info"]["type"] = "Entry Criteria";
                modalContent["info"]["id"] = step;
                break;
            case 3: 
                modalContent["info"]["type"] = "Exit Criteria";
                modalContent["info"]["id"] = step;
                break;
            default: 
                actionModalContent["info"]["name"] = '';
                actionModalContent["info"]["id"] = step;
        }
        document.getElementById("modal-container").className="show";
        setView(getUpdatedView(step));
    }
    /**
     * @description saves the sequence and actions (not being used yet)
     * @param {String} label 
     */
    function saveAction(label){
        let action = {};
        action["CadenceAction_ID__c"] = document.getElementById('action-results').dataset.selectedrecordid;
        doApexAction('ReactController.saveAction', JSON.stringify(action), results => {
            log('saved ==> '+JSON.stringify(results));
        });
        addAction(label);
    }
    return (
        <div className="outer-div">
            <button onClick={() => addNextStep('')} style={{position: "absolute", left: "25%", top: "25%"}}>+ Start Here</button>
            {view}
        </div>
    );
}