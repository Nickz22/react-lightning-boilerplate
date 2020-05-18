import React from 'react'
import RdnaText from '../../../../common/RdnaText'
import styled from 'styled-components'

export default React.memo(function SequenceExitCriteria() {
  return (
    <Grid>
      <RdnaText variant="h2">Sequence Exit Criteria</RdnaText>
      <RdnaText variant="h3">Set condition for your sequence Exit Criteria</RdnaText>
    </Grid>
  )
})

const Grid = styled.div`
  display: grid;
  align-content: start;
`
