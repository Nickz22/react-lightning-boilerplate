import React from 'react';
import Modal from './Modal';

export default function SequenceCriteria({type, ondone}){
    return <Modal type={type} saveaction={ondone} />;
}