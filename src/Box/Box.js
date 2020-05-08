import React from "react";
import './Box.css';
import { log } from "../Util/Util";

const Box = ({label, handlemousedown, onclick, id}) => {
    log('box id ==> '+id);
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