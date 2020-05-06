import React from "react";
import './Modal.css';

const Modal = ({selectactiontype, getactions, saveaction}) => {
    return (
        <div style={{
            position: "fixed", 
            top: "10%", 
            left:"50%",
            backgroundColor: "white", 
            height: 400, 
            width: 275,
            borderRadius: "2%",
            boxShadow: "0 0 2.5px rgb(206, 206, 206)",
            padding: 15,
            overflow: "scroll"
        }}>
            <p>Add an Action</p>
            <div className="action-types">
                <p className="type-header" style={{
                    marginTop: "-5px"
                }}>Type Action</p>
                <div className="types">
                    <p className="type" onClick={selectactiontype}>Call</p>
                    <p className="type" onClick={selectactiontype}>Email</p>
                    <p className="type" onClick={selectactiontype}>SMS</p>
                    <p className="type" onClick={selectactiontype}>Task</p>
                </div>
                <form>
                    <div>
                        <label>Select Action <br />
                            <input type="text" onKeyUp={getactions} name="action" id="action_input"/>
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
                        <button type="reset" style={{border: "none", borderRadius: "2%"}}><p style={{color: "grey", fontSize: "10px"}}>Cancel</p></button>
                        <button onClick={saveaction} type="submit" style={{backgroundColor: "lightgreen",borderRadius: "2%"}}><p style={{fontSize: "10px"}}>Save</p></button>
                    </div>
                </form>
            </div>
        </div> 
    );
};

export default Modal;