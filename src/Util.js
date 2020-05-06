import React from "react";

const doApexAction = (method, params, callback) => {
    console.log('action');
    console.log('method ==> '+method);
    console.log('name ==> '+params);
  Visualforce.remoting.Manager.invokeAction(
        method,
        params,
        (results, event) => {
            if(event.status){
                callback(results);
                return 'success';
            }
            else{
                return 'fail';
            }    
        }
    );
};

export default doApexAction;