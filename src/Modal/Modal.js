import React, {useState} from "react";
import './Modal.css';
import {log, doApexAction} from '../Util/Util.js';

const Modal = ({type, select, oninputkeydown, saveaction}) => {
    const [[modalBody, setModalBody]] = useState([
        getContent()
    ])
    function getContent(){
        if(type.toLowerCase().includes('detail'))
            return getSequenceDetailContent();
        if(type.toLowerCase().includes('entry'))
            return getEntryCriteriaContent();
        if(type.toLowerCase().includes('exit'))
            return getExitCriteriaContent();
    }
    function save(type){
        let name = document.getElementById('action_input').value;
        saveaction({"info":{"name": name, "type" : type}});
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