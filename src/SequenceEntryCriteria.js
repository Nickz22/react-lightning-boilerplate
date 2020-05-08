import React from 'react';
import Modal from './Modal';

export default function SequenceCriteria({id,type, ondone}){
    return <Modal type={type} saveaction={bubble} />;
    function bubble(event){
        console.log('bubble');
        event["id"] = id;
        ondone(event);
    }
}