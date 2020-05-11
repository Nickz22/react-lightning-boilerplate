import React, { useState } from 'react';
import SequenceActions from './SequenceActions';
import SequenceEntryCriteria from './SequenceEntryCriteria'; // had to create two components because dom was not recognizing
import SequenceExitCriteria from './SequenceExitCriteria' //       difference between the two different instances of same component
import SequenceDetail from './SequenceDetail';
import ProgressBar from '../ProgressBar/ProgressBar';
import Box from '../Box/Box';
import AddAction from '../AddAction/AddAction';
import {log} from '../Util/Util.js';
import './SequenceBuilder.css';

export default function App(){
    let sequenceSteps = []; // contains divs for all steps including criteria, sequence name, actions
    let sequenceActionContent = {
        "saveaction" : closeActionModal,
        "info": {
            "name": "",
            "id": ""
        }
    };
    let step = 0;
    let input;
    const [view, setView] = useState([
        getUpdatedView(step)
    ]);
    function getUpdatedView(index){
        log('update view index '+index);
        let viewMap = {
            0 : <div></div>,
            1 : [<ProgressBar boxes={sequenceSteps} />,<div id="modal-container"><SequenceDetail id="1" ondone={closeModal} /></div>],
            2 : [<ProgressBar boxes={sequenceSteps} />,<div id="modal-container" className="show"><SequenceEntryCriteria id="2" type="Entry Criteria" ondone={closeModal}/></div>],
            3 : [<ProgressBar boxes={sequenceSteps} />,<div id="modal-container"><SequenceExitCriteria id="3" type="Exit Criteria" ondone={closeModal}/></div>],
            4 : [<ProgressBar boxes={sequenceSteps} />,<div id="modal-container" className="show"><SequenceActions viewMap={sequenceActionContent} /></div>]
        }
        return viewMap[index > 4 ? 4 : index];
    }
    function setUpdatedState(){
        if(step >= 4){
            document.getElementById("modal-container").className="show";
        }
        setView(getUpdatedView(step));
    }
    function setActionState(id, name){
        sequenceActionContent["info"] = {
                "id": id,
                "name": name
        };
    }

    function closeActionModal(event){
        input = event["info"]["element"];
        document.getElementById("modal-container").className="hide";
        if(!stepExists(event)){
            setBoxState(event);
        }
    }

    function setBoxState(event){
        let actionInsert = sequenceSteps.pop();
        sequenceSteps.push(<div className="line-connector" id={event["info"]["id"] - .5}></div>);
        sequenceSteps.push(<Box id={event["info"]["id"]} label={event["info"]["name"]} onclick={showModal} />);
        sequenceSteps.push(actionInsert);
        document.getElementById("modal-container").className="hide";
        setView(getUpdatedView(event["info"]["id"]));
        step++;
    }

    function closeModal(event){
        document.getElementById("modal-container").className="hide";
        if(!stepExists(event)){
            addNextStep(event);
        }
    }
    
    function addNextStep(event){
        if( document.getElementsByTagName("button").length > 0 )
            showSequenceDetailModal();
        else if( sequenceSteps.length <= 1 )
            addSequenceDetailStep(event);
        else
            addStep(event);
    }

    function stepExists(event){
        log('incoming event id ==> '+event["info"]["id"]);
        let id = parseInt(event["info"]["id"]);
        let stepExists = false;
        let boxMap = new Map(sequenceSteps.map(x => {
            return [x["props"]["id"], x];
        }));
        log('unordered keys : '+JSON.stringify(Array.from(boxMap.keys())));
        if( boxMap.has(id) ){
            boxMap.delete(id);
            boxMap.delete(1000); // remove add action div
            log('splicing');
            log('setting key value '+id);
            boxMap.set(id, <Box id={id} label={event["info"]["name"]} onclick={showModal} />);
            let orderedMap = new Map([...boxMap.entries()].sort());
            log('ordered keys: '+Array.from(orderedMap.keys()));
            sequenceSteps = Array.from(orderedMap.values());
            sequenceSteps.push(getActionInsert()); // replace add action div
            setView(getUpdatedView(id));
            stepExists = true;
        }
        log('exists? '+stepExists);
        return stepExists;
    }

    function showSequenceDetailModal(){
        step++;
        document.getElementsByTagName("button")[0].remove();
        setView(getUpdatedView(step));
    }
    function addSequenceDetailStep(event){
        sequenceSteps.push(<Box label={event["info"]["name"]} onclick={showModal} id={step} />);
        sequenceSteps.push(getActionInsert());
        setView(getUpdatedView(step));
        step++;
    }
    function addStep(event){
        let id = parseInt(event["info"]["id"]);
        log('add step id : '+id);
        let actionInsert = sequenceSteps.pop();
        sequenceSteps.push(<div className="line-connector" id={(id - .5)}></div>);
        sequenceSteps.push(<Box label={event["info"]["name"]} onclick={showModal} id={step} />);
        sequenceSteps.push(actionInsert);
        setView(getUpdatedView(step));
        step++;
    }
    function showModal(event){
        log('box click id ==> '+event["info"]["id"]);
        sequenceActionContent["info"]["id"] = event["info"]["id"];
        document.getElementById("modal-container").className = "show";
        let boxMap = new Map(sequenceSteps.map(x =>[x["props"]["id"], x]));
        if(boxMap.has(event["info"]["id"]) && input){
            input.value = event["info"]["name"];
        }
        setView(getUpdatedView(event["info"]["id"]));
    }
    function getActionInsert(){
        return <AddAction onaddaction={addAction} id={1000}/>
    }
    function addAction(){
        log('step ==> '+step);
        sequenceActionContent["info"]["name"] = '';
        sequenceActionContent["info"]["id"] = step;
        setUpdatedState();
    }
    /**
     * @description will need when user saves the sequence
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