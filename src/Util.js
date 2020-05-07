
const doApexAction = (method, params, callback) => {
    Visualforce.remoting.Manager.invokeAction(
        method,
        params,
        (results, event) => {
            if(event.status){
                callback(results);
            }else if(event.type === 'exception'){
                throw new Error('ERROR: '+event.message+'// STACKTRACE: '+event.where);
            }else{
                console.error('unknown error in '+method);
            }
        }
    );
};

const log = message => {
    console.log(message);
}

export default {doApexAction, log};