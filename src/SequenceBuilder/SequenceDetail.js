import React, { useState } from 'react';
import Modal from '../Modal/Modal';

export default function SequenceDetail({id,ondone}){
    return <Modal type="Sequence Detail" saveaction={bubble}/>;
    function bubble(event){
        console.log('bubble');
        event["info"]["id"] = id;
        ondone(event);
    }
}