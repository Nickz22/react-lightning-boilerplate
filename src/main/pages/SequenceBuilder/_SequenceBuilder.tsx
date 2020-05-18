import React, { useState } from 'react'
import styled from 'styled-components'

import RdnaButton from '../../../common/RdnaButton'
import SequenceDetails from './components/SequenceDetails'
import SequenceEntranceCriteria from './components/SequenceEntranceCriteria'
import SequenceExitCriteria from './components/SequenceExitCriteria'
import SequenceActions from './components/SequenceActions'

const steps = [
  'Sequence Details',
  'Sequence Entrance Criteria',
  'Sequence Exit Criteria',
  'Sequence Actions',
] as const

export default React.memo(function SequenceBuilder() {
  const [activeStep, setActiveStep] = useState<typeof steps[number]>(steps[0])

  const renderContent = () => {
    switch (activeStep) {
      case 'Sequence Details':
        return <SequenceDetails />
      case 'Sequence Entrance Criteria':
        return <SequenceEntranceCriteria />
      case 'Sequence Exit Criteria':
        return <SequenceExitCriteria />
      case 'Sequence Actions':
        return <SequenceActions />
      default:
        return null
    }
  }

  return (
    <Grid>
      <Steps>
        {steps.map((step, index) => (
          <RdnaButton
            key={`${step}-${index}`}
            text={step}
            variant="outlined"
            color={'primary'}
            onClick={() => setActiveStep(step)}
          />
        ))}
      </Steps>
      {renderContent()}
    </Grid>
  )
})

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`
const Steps = styled.div`
  display: grid;
  grid-gap: 6rem 0;
  justify-content: center;
`
