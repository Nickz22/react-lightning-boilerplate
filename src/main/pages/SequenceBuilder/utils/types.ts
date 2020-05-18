import { activationTypes, matchingPriorities, recordTypes } from './constants'

export type SequenceBuilderForm = {
  sequenceName?: string
  recordType?: typeof recordTypes[number]
  activationType?: typeof activationTypes[number]
  matchingPriority?: typeof matchingPriorities[number]
}
