import React from 'react'
import styled from 'styled-components'

import { useHistory, useLocation } from 'react-router-dom'
import { capitalCase } from 'change-case'
import { ROUTER_PATH } from '../../../../utils/constants'

// @ts-ignore
import RdnaLogo from '../../../../assets/rdna-logo.png'
import RdnaText from '../../../../common/RdnaText'

export default React.memo(function Header() {
  const location = useLocation()
  const history = useHistory()

  return (
    <Grid>
      <Logo
        src={RdnaLogo}
        alt="Rdna Logo"
        onClick={() => history.push(ROUTER_PATH.ALL_SEQUENCES)}
      />
      <Title>Sequences</Title>
      <SubTitle variant="h1">{capitalCase(location.pathname)}</SubTitle>
    </Grid>
  )
})

const Grid = styled.div`
  display: grid;
  grid-gap: 0 1rem;
  grid-template-areas:
    'image title . action'
    'image sub-title . action';
  padding: 2rem;
`

const Logo = styled.img`
  grid-area: image;
  justify-self: end;
  align-self: center;
  width: 36px;

  &:hover {
    cursor: pointer;
  }
`

const Title = styled(RdnaText)`
  grid-area: title;
  justify-self: start;
`

const SubTitle = styled(RdnaText)`
  grid-area: sub-title;
  justify-self: start;
`
