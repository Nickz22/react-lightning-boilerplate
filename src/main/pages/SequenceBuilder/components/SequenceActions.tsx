import React from 'react'
import RdnaText from '../../../../common/RdnaText'
import styled from 'styled-components'

export default React.memo(function SequenceActions() {
  return (
    <Grid>
      <RdnaText variant="h2">Sequence Actions</RdnaText>
      <RdnaText variant="h3">
        Add a series of sequence actions based on the existing library
      </RdnaText>
    </Grid>
  )
})

const Grid = styled.div`
  display: grid;
  align-content: start;
`
