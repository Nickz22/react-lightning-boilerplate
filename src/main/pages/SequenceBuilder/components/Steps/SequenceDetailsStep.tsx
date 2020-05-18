import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import RdnaButton, { colorpalettes } from '../../../../../common/RdnaButton'
import {
  isSequenceDetailsFilledOutSelector,
  useSequenceBuilderState,
} from '../../utils/SequenceBuilderContextReducer'

type SequenceDetailsStepProps = {
  setActiveStep: Dispatch<
    SetStateAction<
      | 'Sequence Details'
      | 'Sequence Entrance Criteria'
      | 'Sequence Exit Criteria'
      | 'Sequence Actions'
    >
  >
}

export default React.memo(function SequenceDetailsStep({
  setActiveStep,
}: SequenceDetailsStepProps) {
  const state = useSequenceBuilderState()

  const isSequenceDetailsFilledOut = isSequenceDetailsFilledOutSelector(state)

  const [color, setColor] = useState<keyof typeof colorpalettes>('primary')

  useEffect(() => {
    if (!isSequenceDetailsFilledOut) {
      setColor('alert')
    }
  })

  return (
    <>
      <RdnaButton
        text="Sequence Details"
        onClick={() => setActiveStep('Sequence Details')}
        variant="outlined"
        color={color}
      />
    </>
  )
})
