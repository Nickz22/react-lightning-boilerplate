import React from 'react'
import { SequenceBuilderForm } from './types'

type Action = { type: 'CHANGE_SEQUENCE_BUILDER_FORM'; payload: any }

export type Dispatch = (action: Action) => void
export type SequenceBuilderState = Readonly<{
  sequenceBuilderForm: SequenceBuilderForm
}>

export const initialState: SequenceBuilderState = {
  sequenceBuilderForm: {} as any,
}

export function sequenceBuilderReducer(
  state: SequenceBuilderState = initialState,
  action: Action
): SequenceBuilderState {
  switch (action.type) {
    case 'CHANGE_SEQUENCE_BUILDER_FORM': {
      return {
        ...state,
        sequenceBuilderForm: { ...state.sequenceBuilderForm, ...action.payload },
      }
    }
    default: {
      // @ts-ignore
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

// selectors
export const isSequenceDetailsFilledOutSelector = (state: SequenceBuilderState): boolean => {
  const isMatchingPriorityAccountedFor = state.sequenceBuilderForm.activationType === 'Automatic'

  if (isMatchingPriorityAccountedFor) {
    return (
      !!state.sequenceBuilderForm.sequenceName &&
      !!state.sequenceBuilderForm.recordType &&
      !!state.sequenceBuilderForm.activationType &&
      // then include matchingPriority field
      !!state.sequenceBuilderForm.matchingPriority
    )
  }

  return (
    !!state.sequenceBuilderForm.sequenceName &&
    !!state.sequenceBuilderForm.recordType &&
    !!state.sequenceBuilderForm.activationType
    // else do not include matchingPriority
  )
}

// context
export const SequenceBuilderStateContext = React.createContext<SequenceBuilderState | undefined>(
  undefined
)
export const SequenceBuilderDispatchContext = React.createContext<Dispatch | undefined>(undefined)

export function useSequenceBuilderState() {
  const context = React.useContext(SequenceBuilderStateContext)
  if (!context) {
    throw new Error('useSequenceBuilderState must be used within a SequenceBuilderProvider')
  }
  return context
}

export function useSequenceBuilderDispatch() {
  const context = React.useContext(SequenceBuilderDispatchContext)
  if (!context) {
    throw new Error('useSequenceBuilderDispatch must be used within a SequenceBuilderProvider')
  }
  return context
}
