import React from 'react'
import styled from 'styled-components'
import RdnaText from '../../../../common/RdnaText'

export default React.memo(function SequenceEntranceCriteria() {
  return (
    <Grid>
      <RdnaText variant="h2">Sequence Entrance Criteria</RdnaText>
      <RdnaText variant="h3">Set condition for your sequence Entrance Criteria</RdnaText>
    </Grid>
  )
})

const Grid = styled.div`
  display: grid;
  align-content: start;
`
