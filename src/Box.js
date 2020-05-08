import React from "react";
import './Box.css';

const Box = ({label, handlemousedown, onclick, id}) => {
    console.log('init box with label ==> '+label);

    return (
        <div onMouseDown={handlemousedown} 
            className="dragger"
            onClick={() => onclick(id)}
        // onMouseUp={handleMouseUp}           will need
        // onMouseOut={handleMouseOut}         these for 
        // onMouseMove={handleScroll}      moving action order
            id="dont-drag">
            <p className="action-label">{label}</p>
        </div>
    );
};

export default Box;