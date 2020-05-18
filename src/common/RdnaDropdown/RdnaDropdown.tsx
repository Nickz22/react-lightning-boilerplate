import React from 'react'
import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core'
import { FormSelectOption, InputComponentProps } from './formInputs'
import styled from 'styled-components'

const Icon = styled.div`
  padding: 0;
  padding-right: 16px;
  display: flex;
`

type Props = InputComponentProps & {
  staticLabel?: boolean
}

export default function RdnaDropDown({
  inputData,
  value,
  isAutoWidth,
  isError,
  isDisabled,
  isMultiple,
  errorMessage,
  helperMessage,
  handleChange,
  staticLabel,
}: Props) {
  let options = inputData.options
  if (inputData && inputData.options && inputData.options.length) {
    if (typeof inputData.options[0] === 'string') {
      options = (inputData.options as Array<string>).map((name: string) => {
        return { value: name, label: name }
      })
    }
  }

  if (isMultiple && typeof value !== 'object') {
    value = value ? [value] : []
  }

  const displayValue = (options as Array<FormSelectOption>)
    .filter((optionItem: FormSelectOption) => {
      if (isMultiple) {
        return (value as string[]).indexOf(optionItem.value) > -1
      } else {
        return value === optionItem.value
      }
    })
    .map((optionItem: FormSelectOption) => {
      return optionItem.label
    })
    .join(', ')

  return (
    <FormControl variant="outlined" error={isError} disabled={isDisabled}>
      <Container staticLabel={staticLabel}>
        <InputLabel htmlFor={`${inputData.name}-select`} required={inputData.required}>
          {inputData.label}
        </InputLabel>
      </Container>
      <Select
        id="ringdna-select"
        value={value}
        {...(isAutoWidth ? { autoWidth: true } : { fullWidth: true })}
        multiple={isMultiple}
        onChange={handleChange}
        renderValue={() =>
          isMultiple
            ? (value as string[]).length < 3
              ? displayValue
              : 'Multiple items selected'
            : displayValue
        }
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          getContentAnchorEl: null,
        }}
        data-testid={`${inputData.name}-input`}
        inputProps={{
          name: `${inputData.name}`,
          id: `${inputData.name}-select`,
        }}
      >
        {options &&
          options.length &&
          (options as Array<FormSelectOption>).map((optionItem: FormSelectOption) => (
            <MenuItem
              key={optionItem.value}
              value={optionItem.value}
              data-testid={`option-${optionItem.value}`}
            >
              {isMultiple && !optionItem.icon && !optionItem.Icon && (
                <Checkbox checked={(value as string[]).indexOf(optionItem.value) > -1} />
              )}
              {(optionItem.Icon || optionItem.icon) && (
                <Icon>
                  {optionItem.Icon ? (
                    <optionItem.Icon />
                  ) : (
                    <img src={optionItem.icon} alt={optionItem.value} />
                  )}
                </Icon>
              )}
              {optionItem.label}
            </MenuItem>
          ))}
      </Select>
      <FormHelperText>{isError ? errorMessage : helperMessage}</FormHelperText>
    </FormControl>
  )
}

const Container = styled.div<{ staticLabel: boolean | undefined }>`
  ${(props) =>
    props.staticLabel
      ? `
  .MuiInputLabel-formControl {
    color: ` +
        props.theme.palette.neutral.main +
        `;
  }
  .MuiInputLabel-outlined.MuiInputLabel-shrink {
    opacity: 0;
  }
  .Mui-focused {
    opacity: 0;
  }`
      : ''}
`
