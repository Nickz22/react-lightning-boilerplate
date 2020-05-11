import React from 'react';
import Modal from '../Modal/Modal';

export default function SequenceCriteria({id,type, ondone}){
    return <Modal type={type} saveaction={bubble} />;
    function bubble(event){
        console.log('bubble ID: '+id);
        event["info"]["id"] = id;
        ondone(event);
    }
}