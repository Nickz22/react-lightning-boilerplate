import React, { useState } from 'react'
import styled from 'styled-components'

import { InputField, InputTypes } from '../../../../common/RdnaDropdown/formInputs'

import RdnaText from '../../../../common/RdnaText'
import RdnaDropDown from '../../../../common/RdnaDropdown/RdnaDropdown'
import { activationTypes, matchingPriorities, recordTypes } from '../utils/constants'
import {
  isSequenceDetailsFilledOutSelector,
  useSequenceBuilderDispatch,
  useSequenceBuilderState,
} from '../utils/SequenceBuilderContextReducer'

const recordTypeInputData: InputField = {
  type: InputTypes.DROPDOWN,
  label: 'Record Type',
  name: 'record-type',
  placeholder: 'Select Record Type',
  options: recordTypes.map((option) => ({ label: option, value: option })),
  required: true,
  validationText: 'Please Select record type.',
}

const activationTypeInputData: InputField = {
  type: InputTypes.DROPDOWN,
  label: 'Activation Type',
  name: 'activation-type',
  placeholder: 'Select Activation Type',
  options: activationTypes.map((option) => ({ label: option, value: option })),
  required: true,
  validationText: 'Please Select activation type1.',
  helperText: 'Please Select activation type.',
}

const matchingPriorityInputData: InputField = {
  type: InputTypes.DROPDOWN,
  label: 'Matching Priority',
  name: 'matching-priority',
  placeholder: 'Select Matching Priority',
  options: matchingPriorities.map((option) => ({ label: option, value: option })),
  required: true,
  validationText: 'Please Select matching priority.',
}

export default React.memo(function SequenceDetails() {
  const dispatch = useSequenceBuilderDispatch()
  const { sequenceBuilderForm } = useSequenceBuilderState()

  return (
    <Grid>
      <RdnaText variant="h2">Sequence Details</RdnaText>
      <RdnaText variant="h3">Enter the basic sequence details for your new sequence list.</RdnaText>
      <div>
        <label htmlFor="sequence-name">Sequence Name</label>
        <input
          id="sequence-name"
          name="sequence-name"
          type="text"
          value={sequenceBuilderForm.sequenceName}
          onChange={({ target: { value } }) =>
            dispatch({
              type: 'CHANGE_SEQUENCE_BUILDER_FORM',
              payload: { sequenceName: value },
            })
          }
        />
      </div>
      <RdnaDropDown
        value={sequenceBuilderForm.recordType}
        inputData={recordTypeInputData}
        handleChange={({ target: value }) =>
          dispatch({
            type: 'CHANGE_SEQUENCE_BUILDER_FORM',
            payload: { recordType: value },
          })
        }
      />
      <RdnaDropDown
        value={sequenceBuilderForm.activationType}
        inputData={activationTypeInputData}
        handleChange={({ target: value }) =>
          dispatch({
            type: 'CHANGE_SEQUENCE_BUILDER_FORM',
            payload: { activationType: value },
          })
        }
      />
      {sequenceBuilderForm.activationType === 'Automatic' && (
        <RdnaDropDown
          value={sequenceBuilderForm.matchingPriority}
          inputData={matchingPriorityInputData}
          handleChange={({ target: value }) =>
            dispatch({
              type: 'CHANGE_SEQUENCE_BUILDER_FORM',
              payload: { activationType: value },
            })
          }
        />
      )}
    </Grid>
  )
})

const Grid = styled.div`
  display: grid;
  grid-gap: 1rem 0;
  align-content: start;
`
