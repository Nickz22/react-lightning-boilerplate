import React, { useState } from 'react';
import './App.css';
import SequenceActions from './SequenceActions';
import SequenceCriteria from './SequenceCriteria';
import SequenceDetail from './SequenceDetail';
import ProgressBar from './ProgressBar';
import Box from './Box';
import {log} from './Util';
import AddAction from './AddAction';

export default function App(){
    let sequenceSteps = [];
    let step = 0;
    const [view, setView] = useState([
        getUpdatedView(step, [])
    ]);
    function getUpdatedView(){
        console.log('updating view with step ==> '+step);
        let viewMap = {
            0 : <div></div>,
            1 : [<ProgressBar boxes={sequenceSteps} action={setUpdatedState}/>,<div id="sequence-detail"><SequenceDetail ondone={closeModal} /></div>],
            2 : [<ProgressBar boxes={sequenceSteps}/>,<div id="criteria" className="show"><SequenceCriteria type="entry criteria" ondone={closeModal}/></div>],
            3 : [<ProgressBar boxes={sequenceSteps}/>,<SequenceCriteria type="exit" ondone={closeModal}/>],
            4 : [<ProgressBar boxes={sequenceSteps}/>,<SequenceActions ondone={closeModal} />]
        }
        return viewMap[step];
    }

    function setUpdatedState(){
        setView(getUpdatedView());
    }

    function closeModal(event){
        console.log('event type ==> '+event["type"]);
        if(event["type"].toLowerCase().includes('detail')){
            console.log('hide detail');
            document.getElementById("sequence-detail").className="hide";
        }
        if(event["type"].toLowerCase().includes('criteria')){
            console.log('hide criteria');
            document.getElementById("criteria").className="hide";
        }
        showNextStep(event["name"]);
    }
    function showNextStep(label){
        if( document.getElementsByTagName("button").length > 0 ){
            step++;
            document.getElementsByTagName("button")[0].remove();
            setView(getUpdatedView());
        }else if( label && label.length > 0 && sequenceSteps.length <= 2 ){
            sequenceSteps.push(<Box label={label} />);
            sequenceSteps.push(getActionInsert());
            setView(getUpdatedView());
            step++;
        }else if( sequenceSteps.length > 2 ){
            sequenceSteps.push(<div className="line-connector"></div>);
            sequenceSteps.push(<Box label={label} />);
            sequenceSteps.push(getActionInsert());
            setView(getUpdatedView());
            step++;
        }
        console.log('step 2 ==> '+step);
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
        // action();
        console.log('add');
        setUpdatedState();
    }
    return (
        <div className="outer-div">
            <button onClick={() => showNextStep('')} style={{position: "absolute", left: "25%", top: "25%"}}>+ Start Here</button>
            {view}
        </div>
    );
}