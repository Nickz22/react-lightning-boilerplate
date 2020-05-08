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
    let sequenceActions = [<SequenceActions id="4" ondone={closeModal} />]; // contains only sequence actions
    let step = 0;
    const [view, setView] = useState([
        getUpdatedView(step)
    ]);
    function getUpdatedView(index){
        let viewMap = {
            0 : <div></div>,
            1 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="1"><SequenceDetail id="1" ondone={closeModal} /></div>],
            2 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="2" className="show"><SequenceEntryCriteria id="2" type="Entry Criteria" ondone={closeModal}/></div>],
            3 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="3"><SequenceExitCriteria id="3" type="Exit Criteria" ondone={closeModal}/></div>],
            4 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="4" className="show">{sequenceActions}</div>]
        }
        return viewMap[index > 4 ? 4 : index];
    }

    function setUpdatedState(){
        if(step > 4){
            sequenceActions.push(<SequenceActions id={step} ondone={closeModal} />);
            document.getElementById("4").className="show";
        }
        setView(getUpdatedView(step));
    }

    function closeModal(event){
        if(event["id"] == 1)
            document.getElementById("1").className="hide";
        if(event["id"] == 2)
            document.getElementById("2").className="hide";
        if(event["id"] == 3)
            document.getElementById("3").className="hide";
        if(event["id"] >= 4){
            document.getElementById("4").className="hide";
        }
        addNextStep(event);
    }
    
    function addNextStep(event){
        if( stepExists(event) ){
            return;
        }
        if( document.getElementsByTagName("button").length > 0 ){
            showSequenceDetailModal();
        }else if( event["name"] && event["name"].length > 0 && sequenceSteps.length <= 1 ){
            addSequenceDetailStep(event);
        }else{
            addStep(event);
        }
    }   

    function stepExists(event){
        let stepExists = false;
        for(let i = 0; i<sequenceSteps.length;i++){
            if(sequenceSteps[i]["props"]["id"] == event["id"] && event["id"] != 4){
                sequenceSteps.splice(i,1,<Box id={event["id"]} label={event["name"]} onclick={showModal} />);
                setView(getUpdatedView(event["id"]));
                stepExists = true ;
            }
        }
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
        /**
         * need to figure out how i'll show respective sequence action modals
         *      this approach only shows the modal container div
         */
        document.getElementById(id >= 4 ? 4 : id).className = "show";
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