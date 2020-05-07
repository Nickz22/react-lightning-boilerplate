import React, {useState} from "react";
import './Modal.css';

const Modal = ({type, selectactiontype, oninputkeydown, saveaction}) => {
    const [[modalBody, setModalBody]] = useState([
        getContent()
    ])
    function getContent(){
        console.log('type ==> '+type);
        if(type.toLowerCase().includes('action'))
            return getSequenceActionContent();
        if(type.toLowerCase().includes('detail'))
            return getSequenceDetailContent();
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
                    <p className="type" onClick={selectactiontype}>IMG</p>
                    <p className="type" onClick={selectactiontype}>IMG</p>
                    <p className="type" onClick={selectactiontype}>IMG</p>
                    <p className="type" onClick={selectactiontype}>IMG</p>
                    <p className="type" onClick={selectactiontype}>IMG</p>
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
                <p className="type" onClick={selectactiontype}>Call</p>
                <p className="type" onClick={selectactiontype}>Email</p>
                <p className="type" onClick={selectactiontype}>SMS</p>
                <p className="type" onClick={selectactiontype}>Task</p>
            </div>
            <form>
                <div>
                    <label>Select Action <br />
                        <input type="text" onKeyUp={oninputkeydown} name="action" id="action_input"/>
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

    return (
        /**
         * having trouble moving this style into a class
         */
        <div style={{
            position: "fixed", 
            top: "10%", 
            left:"50%",
            backgroundColor: "white", 
            height: 350, 
            width: 275,
            borderRadius: "2%",
            boxShadow: "0 0 2.5px rgb(206, 206, 206)",
            padding: 15,
            overflow: "scroll"
        }}>
            <p>{type}</p>
            <div className="action-types">
                {modalBody}
            </div>
        </div> 
    );
};

export default Modal;