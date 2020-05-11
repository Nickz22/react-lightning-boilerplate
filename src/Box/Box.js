import React from "react";
import './Box.css';
import { log } from "../Util/Util";

const Box = ({label, handlemousedown, onclick, id}) => {
    log('box init w label ==> '+label);
    return (
        <div onMouseDown={handlemousedown} 
            className="dragger"
            onClick={() => onclick({"info":{
                "id": id,
                "name": label
            }})}
        // onMouseUp={handleMouseUp}           will need
        // onMouseOut={handleMouseOut}         these for 
        // onMouseMove={handleScroll}      moving action order
            id="dont-drag">
            <p className="action-label">{label}</p>
        </div>
    );
};

export default Box;