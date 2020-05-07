import React, { useState } from 'react';

export default function SequenceCriteria({type, ondone}){
    return <p onClick={() => ondone({"name":'criteria', "type" : 'criteria'})}> Criteria Type: {type} </p>;
}