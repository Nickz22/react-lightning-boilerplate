
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
}

const getStepMap = sequenceSteps => {
    if(sequenceSteps.length > 0){
        log('checking id of first entry in steps ==> '+sequenceSteps[0]["props"]["id"]);
    }
    let stepMap = new Map(sequenceSteps.map(x =>[x["props"]["id"], x]));
    log('stepMap ==> '+JSON.stringify(stepMap));
    return stepMap;
}

const log = (message) => {
    console.log(message);
}

export {doApexAction, log, getStepMap};