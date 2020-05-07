import React from "react";
import './AddAction.css';
import PlusSign from './PlusSign';

const AddAction = ({onaddaction}) => {
    return (
        <div style={{display: 'block'}}>
            <div className="new-action-connector"></div> 
            <div className="add-action">
                <PlusSign onclick={onaddaction}/>
            </div>
                    </div> 
    );
};
export default AddAction;