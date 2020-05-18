import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { GridSize } from '@material-ui/core/Grid'

export type InputChangeEvent = (event: any, value?: any) => void

export type InputComponentProps = {
  inputData: InputField
  value: string | string[] | number[] | AutoCompleteInputData
  isError?: boolean
  isDisabled?: boolean
  isMultiple?: boolean
  isAutoWidth?: boolean
  errorMessage?: string
  helperMessage?: string
  className?: string
  handleChange: InputChangeEvent
  handleBlur?: (field: string, touched?: boolean, shouldValidate?: boolean) => void
}

export type InputField = {
  type: InputTypes
  name: string
  chipLabel?: string | null
  label?: string
  required: boolean
  maxTextLength?: number
  autoWidth?: boolean
  autoload?: true
  placeholder?: string
  helperText?: string
  validationText?: string
  customEndpoint?: string
  customSearchParam?: string
  defaultValue?: string
  disableFuture?: boolean
  multipleValues?: boolean
  showChipsLocally?: boolean
  accountId?: string
  options?: (FormSelectOption | string)[]
  gridLayout?: InputGrid
  searchType?: string
  autoFocus?: boolean
  minValue?: RangeOption
  maxValue?: RangeOption
  disabled?: boolean
  rows?: number
  className?: string
}

export type AutoCompleteInputData = {
  value: string
  label: string
}

export type InputGrid = Partial<Record<Breakpoint, boolean | GridSize>>

export type FormSelectOption = {
  label: string
  value: string
  icon?: string
  Icon?: React.ComponentType
}

export type RangeOption = {
  value: number
  label?: string
}

export enum InputTypes {
  AUTOCOMPLETE = 'autocomplete',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  DROPDOWN = 'select',
  EMAIL = 'email',
  HIDDEN = 'hidden',
  PASSWORD = 'password',
  PHONE = 'tel',
  RADIO = 'radio',
  RANGE_SLIDER = 'range slider',
  SEARCH = 'search',
  TEXT = 'text',
  TEXT_AREA = 'text area',
}
