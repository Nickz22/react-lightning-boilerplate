import React from 'react'
import {
  SequenceBuilderStateContext,
  SequenceBuilderDispatchContext,
  sequenceBuilderReducer,
  initialState,
} from './utils/SequenceBuilderContextReducer'

import SequenceBuilder from './_SequenceBuilder'

export default React.memo(function SequenceBuilderProvider() {
  const [state, dispatch] = React.useReducer(sequenceBuilderReducer, initialState)

  return (
    <SequenceBuilderStateContext.Provider value={state}>
      <SequenceBuilderDispatchContext.Provider value={dispatch}>
        <SequenceBuilder />
      </SequenceBuilderDispatchContext.Provider>
    </SequenceBuilderStateContext.Provider>
  )
})
