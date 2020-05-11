import React from 'react';
import Modal from '../Modal/Modal';

export default function SequenceCriteria({id,type, ondone}){
    return <Modal type={type} saveaction={bubble} />;
    function bubble(event){
        console.log('incoming event: '+JSON.stringify(event));
        console.log('bubbling id ==> '+id);
        event["info"]["id"] = id;
        ondone(event);
    }
}