import React, {useState} from 'react';
import {log, doApexAction} from '../Util/Util.js';

export default function LinkedIn(){
    log('linkedin !!!');

    const [user, setUser] = useState([
        "test name"
    ]);

    return(
        <div style={{position: "absolute", top: "30%", left: "30%", cursor: "pointer"}} onClick={() => doApexAction('LinkedlnoAuthController.doGetAuthorizationCode', {}, results => {window.open(results, '_blank')})}> 
            Login to LinkedIn
        </div>
    ); 
}