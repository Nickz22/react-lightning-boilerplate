import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'

import { ROUTER_PATH } from '../../utils/constants'

import SequenceBuilder from '../pages/SequenceBuilder'
import Sequences from '../pages/Sequences'

export default React.memo(function Routes() {
  return (
    <Switch>
      <Route exact path={ROUTER_PATH.ALL_SEQUENCES} component={Sequences} />
      <Route exact path={ROUTER_PATH.NEW_SEQUENCE} component={SequenceBuilder} />
      <Redirect exact from="*" to={ROUTER_PATH.ALL_SEQUENCES} />
    </Switch>
  )
})
