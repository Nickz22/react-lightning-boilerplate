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
    let sequenceActionMap = {};
    let step = 0;
    const [view, setView] = useState([
        getUpdatedView(step)
    ]);
    function getUpdatedView(index){
        let viewMap = {
            0 : <div></div>,
            1 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="modal-container"><SequenceDetail id="1" ondone={closeModal} /></div>],
            2 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="modal-container" className="show"><SequenceEntryCriteria id="2" type="Entry Criteria" ondone={closeModal}/></div>],
            3 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="modal-container"><SequenceExitCriteria id="3" type="Exit Criteria" ondone={closeModal}/></div>],
            4 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="modal-container" className="show">{sequenceActionMap[index-4]}</div>]
        }
        return viewMap[index > 4 ? 4 : index];
    }

    function setUpdatedState(){
        if(step >= 4){
            sequenceActionMap[(step - 4)] = <SequenceActions id={step} ondone={closeActionModal} />;
            document.getElementById("modal-container").className="show";
        }
        setView(getUpdatedView(step));
    }

    function closeActionModal(event){
        log('incoming action id ==> '+event["id"]);
        if(sequenceActionMap[event["id"] - 4]){
            setBoxState(event);
        }
    }

    function setBoxState(event){
        log('steps length ==> '+sequenceSteps.length);
        sequenceActionMap[event["id"] - 4] = <SequenceActions id={step} ondone={closeActionModal} />;
        let actionInsert = sequenceSteps.pop();
        sequenceSteps.push(<div className="line-connector"></div>);
        sequenceSteps.push(<Box id={event["id"]} label={event["name"]} onclick={showModal} />);
        sequenceSteps.push(actionInsert);
        document.getElementById("modal-container").className="hide";
        setView(getUpdatedView(event["id"]));
        // for(let i = 0; i<sequenceSteps.length;i++){
        //     if( sequenceSteps[i]["props"]["id"] == event["id"] ){
        //         log('here');
        //         sequenceSteps.splice((event["id"] - 1),1,<Box id={event["id"]} label={event["name"]} onclick={showModal} />);
        //         setView(getUpdatedView((event["id"] - 1)));
        //         break;
        //     }
        // }
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
        log('incoming name ==> '+event["name"]);
        log('incoming id ==> '+event["id"]);
        let stepExists = false;
        for(let i = 0; i<sequenceSteps.length;i++){
            if( sequenceSteps[i]["props"]["id"] == event["id"] && event["id"] < 4 ){
                sequenceSteps.splice(i,1,<Box id={event["id"]} label={event["name"]} onclick={showModal} />);
                setView(getUpdatedView(event["id"]));
                stepExists = true;
                break;
            }else if( event["id"] >= 4 ){ // look through sequence actions
                if(sequenceActionMap[event["id"] - 4]){
                    log('action exists');
                    sequenceSteps.splice(3,1,<Box id={event["id"]} label={event["name"]} onclick={showModal} />);
                    setView(getUpdatedView(event["id"]));
                    document.getElementById("modal-container").className = "hide";
                    stepExists = true;
                    break;
                }else{
                    // log('action does not exist, creating new');
                    // sequenceActionMap[event["id"] - 4] = <SequenceActions id="4" ondone={closeModal} />;
                    // setView(getUpdatedView(event["id"]));
                    // document.getElementById("modal-container").className = "hide";
                    // break;
                }
            }
        }
        log('exists ? '+stepExists);
        return stepExists;
    }
    function showSequenceDetailModal(){
        step++;
        document.getElementsByTagName("button")[0].remove();
        setView(getUpdatedView(step));
    }
    function addSequenceDetailStep(event){
        sequenceSteps.push(<Box label={event["name"]} onclick={showModal} id={step} />);
        sequenceSteps.push(getActionInsert());
        setView(getUpdatedView(step));
        step++;
    }
    function addStep(event){
        let actionInsert = sequenceSteps.pop();
        sequenceSteps.push(<div className="line-connector"></div>);
        sequenceSteps.push(<Box label={event["name"]} onclick={showModal} id={step} />);
        sequenceSteps.push(actionInsert);
        setView(getUpdatedView(step));
        step++;
    }
    function showModal(id){
        document.getElementById("modal-container").className = "show";
        setView(getUpdatedView(id));
    }
    function getActionInsert(){
        return <AddAction onaddaction={addAction}/>
    }
    function addAction(){
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