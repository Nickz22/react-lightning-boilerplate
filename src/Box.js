import React from "react";
import './Box.css';

const Box = ({label, handlemousedown, onclick}) => {
    console.log('init box with label ==> '+label);
    return (
        <div onMouseDown={handlemousedown} 
            className="dragger"
            onClick={() => onclick(label)}
        // onMouseUp={handleMouseUp}           will need
        // onMouseOut={handleMouseOut}         these for 
        // onMouseMove={handleScroll}      moving action order
            id="dont-drag">
            <p className="action-label">{label}</p>
        </div>
    );
};

export default Box;