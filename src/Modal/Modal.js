import React, {useState} from "react";
import './Modal.css';
import {log, doApexAction} from '../Util/Util.js';

const Modal = ({type, select, oninputkeydown, saveaction}) => {
    const [[modalBody, setModalBody]] = useState([
        getContent()
    ])
    function getContent(){
        if(type.toLowerCase().includes('action'))
            return getSequenceActionContent();
        if(type.toLowerCase().includes('detail'))
            return getSequenceDetailContent();
        if(type.toLowerCase().includes('entry'))
            return getEntryCriteriaContent();
        if(type.toLowerCase().includes('exit'))
            return getExitCriteriaContent();
    }
    function save(type){
        if(type.toLowerCase().includes('action')){
            let name = document.getElementById('action_input').value;
            saveaction({"name": name, "type" : type});
        }
        if(type.toLowerCase().includes('detail')){
            let name = document.getElementById('action_input').value;
            saveaction({"name": name, "type" : type});
        }
        if(type.toLowerCase().includes('entry')){
            let name = document.getElementById('action_input').value;
            saveaction({"name": name, "type" : type});
        }
        if(type.toLowerCase().includes('exit')){
            let name = document.getElementById('action_input').value;
            saveaction({"name": name, "type" : type});
        }
    }

    function getSequenceDetailContent(){
        return(
            <div>
            <p className="type-header" style={{
                marginTop: "-5px"
            }}>Sequence Detail</p>
            <form>
                <div>
                    <label>Sequence Name<br />
                        <input type="text" onKeyUp={oninputkeydown} name="action" id="action_input"/>
                        <div id="action-results" selectedrecordid="" className="action-result-panel"></div>
                    </label>
                </div>
                <div className="types">
                    <p className="type" onClick={select}>IMG</p>
                    <p className="type" onClick={select}>IMG</p>
                    <p className="type" onClick={select}>IMG</p>
                    <p className="type" onClick={select}>IMG</p>
                    <p className="type" onClick={select}>IMG</p>
                </div>
                <div>
                    <label>Activation Type <br />
                        <input type="radio"/>  Automatic<br/>
                        <input type="radio"/>  Manual<br/>
                    </label>
                </div>
                <div>
                    <label>Priority <br />
                        <input type="radio"/>  1<br/>
                        <input type="radio"/>  2<br/>
                        <input type="radio"/>  3<br/>
                        <input type="radio"/>  4<br/>
                    </label>
                </div>
                <div style={{display: "flex", height: "40px", width: "70px"}}>
                    {/* <button style={{border: "none", borderRadius: "2%"}}><p style={{color: "grey", fontSize: "10px"}}>Cancel</p></button> */}
                    <p style={{color: "grey", marginLeft:"5px", fontSize: "10px"}}>Cancel</p>
                    {/* <button onClick={saveaction} style={{backgroundColor: "lightgreen",borderRadius: "2%"}}><p style={{fontSize: "10px"}}>Save</p></button> */}
                    <p onClick={() => save(type)} style={{fontSize: "10px",marginLeft:"5px"}}>Save</p>
                </div>
            </form>
            </div>
        );
    }

    function getSequenceActionContent(){
        return (
            <div>
            <p className="type-header" style={{
                marginTop: "-5px"
            }}>Type Action</p>
            <div className="types">
                <p className="type" onClick={select}>Call</p>
                <p className="type" onClick={select}>Email</p>
                <p className="type" onClick={select}>SMS</p>
                <p className="type" onClick={select}>Task</p>
            </div>
            <form>
                <div>
                    <label>Select Action <br />
                        <input type="text" onKeyUp={getActions} name="action" id="action_input"/>
                        <div id="action-results" selectedrecordid="" className="action-result-panel"></div>
                    </label>
                </div>
                <div>
                    <label>Execution Time <br />
                        <input type="text" name="time"/>
                    </label>
                </div>
                <div>
                    <label>Field Updates <br />
                        <input type="radio"/>  No Field Updates<br/>
                        <input type="radio"/>  Field Updates Required<br/>
                    </label>
                </div>
                <div>
                    <label>Criteria <br />
                        <input type="radio"/>  No Additional Criteria<br/>
                        <input type="radio"/>  Conditions are met<br/>
                    </label>
                </div>
                <div style={{display: "flex", height: "40px", width: "70px"}}>
                    {/* <button style={{border: "none", borderRadius: "2%"}}><p style={{color: "grey", fontSize: "10px"}}>Cancel</p></button> */}
                    <p style={{color: "grey", marginLeft:"5px", fontSize: "10px"}}>Cancel</p>
                    {/* <button onClick={saveaction} style={{backgroundColor: "lightgreen",borderRadius: "2%"}}><p style={{fontSize: "10px"}}>Save</p></button> */}
                    <p onClick={() => save(type)} style={{fontSize: "10px",marginLeft:"5px"}}>Save</p>
                </div>
            </form>
            </div>
        );
    }

    function getEntryCriteriaContent(){
        return (
            <div>
            <p className="type-header" style={{
                marginTop: "-5px"
            }}>Condition</p>
            <form>
                <div>
                    <label>Select Field <br />
                        <input type="text" onKeyUp={oninputkeydown} name="action" id="action_input"/>
                        <div id="action-results" selectedrecordid="" className="action-result-panel"></div>
                    </label>
                </div>
                <div>
                    <label>Select Operator <br />
                        <input type="text" name="time"/>
                    </label>
                </div>
                <div>
                    <label>Select Value <br />
                        <input type="radio"/>  No Field Updates<br/>
                        <input type="radio"/>  Field Updates Required<br/>
                    </label>
                </div>
                <div style={{display: "flex", height: "40px", width: "70px"}}>
                    {/* <button style={{border: "none", borderRadius: "2%"}}><p style={{color: "grey", fontSize: "10px"}}>Cancel</p></button> */}
                    <p style={{color: "grey", marginLeft:"5px", fontSize: "10px"}}>Cancel</p>
                    {/* <button onClick={saveaction} style={{backgroundColor: "lightgreen",borderRadius: "2%"}}><p style={{fontSize: "10px"}}>Save</p></button> */}
                    <p onClick={() => save(type)} style={{fontSize: "10px",marginLeft:"5px"}}>Save</p>
                </div>
            </form>
            </div>
        );
    }
    function getExitCriteriaContent(){
        return (
            <div>
            <p className="type-header" style={{
                marginTop: "-5px"
            }}>Condition</p>
            <form>
                <div>
                    <label>Select Field <br />
                        <input type="text" onKeyUp={oninputkeydown} name="action" id="action_input"/>
                        <div id="action-results" selectedrecordid="" className="action-result-panel"></div>
                    </label>
                </div>
                <div>
                    <label>Select Operator <br />
                        <input type="text" name="time"/>
                    </label>
                </div>
                <div>
                    <label>Select Value <br />
                        <input type="radio"/>  No Field Updates<br/>
                        <input type="radio"/>  Field Updates Required<br/>
                    </label>
                </div>
                <div style={{display: "flex", height: "40px", width: "70px"}}>
                    {/* <button style={{border: "none", borderRadius: "2%"}}><p style={{color: "grey", fontSize: "10px"}}>Cancel</p></button> */}
                    <p style={{color: "grey", marginLeft:"5px", fontSize: "10px"}}>Cancel</p>
                    {/* <button onClick={saveaction} style={{backgroundColor: "lightgreen",borderRadius: "2%"}}><p style={{fontSize: "10px"}}>Save</p></button> */}
                    <p onClick={() => save(type)} style={{fontSize: "10px",marginLeft:"5px"}}>Save</p>
                </div>
            </form>
            </div>
        );
    }
    function getActions(e){
        if(e.target.value.length > 2){
            disperseActions();
            fetchActions(e.target.value);
        }
    }
    function fetchActions (actionName){
        log('fetch');
        doApexAction('ReactController.getActions', actionName, processFetchResults);
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
    function disperseActions(){
        let resultsToDisperse = document.querySelectorAll(".action-name");
        if(resultsToDisperse && resultsToDisperse.length > 0){
            for( let x = 0; x < resultsToDisperse.length; x++){
                resultsToDisperse[x].remove();
            }
        }
    }
    function handleActionClick(e){
        let input = document.getElementById('action_input');
        input.value = e.target.textContent;
        let i = document.getElementById('action-results');
        i.dataset.selectedrecordid = e.target.dataset.recordid;
        disperseActions();
    }
    return (
        <div className="outer-container">
            <p>{type}</p>
            <div className="action-types">
                {modalBody}
            </div>
        </div> 
    );
};

export default Modal;