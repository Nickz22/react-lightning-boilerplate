import React, { useState } from 'react';
import Modal from './Modal';

export default function SequenceDetail({ondone}){
    return <Modal type="Sequence Detail" saveaction={ondone}/>;
}