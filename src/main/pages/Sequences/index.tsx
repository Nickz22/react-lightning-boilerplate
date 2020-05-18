import React from 'react'
import { useHistory } from 'react-router-dom'

import { ROUTER_PATH } from '../../../utils/constants'

import RdnaButton from '../../../common/RdnaButton'

export default React.memo(function Sequences() {
  const history = useHistory()
  return (
    <RdnaButton
      text="New Sequence"
      name="create-new-sequence"
      onClick={() => history.push(ROUTER_PATH.NEW_SEQUENCE)}
    />
  )
})
