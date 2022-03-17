/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import CurrencyFormat from 'react-currency-format'
import { ActionMeta } from 'react-select'

import { Label } from '../Label'
import { CurrencyInput } from './CurrencyInput'
import { Container, ErrorMessage, Select, StyledInput } from './styles'

interface ISelectOption {
  value: string | number
  label: string
}

interface IInputProps {
  name: string
  isSelect?: boolean | undefined
  /** @default false */
  isMulti?: boolean | undefined
  /** @default false */
  isCurrency?: boolean | undefined
  autoFocus?: boolean | undefined
  /** @default [] */
  options?: ISelectOption[]
  label?: string | undefined
  /** @default 'text' */
  type?: React.HTMLInputTypeAttribute | undefined
  htmlFor?: string | undefined
  required?: boolean | undefined
  placeholder?: string | undefined
  error?: string | undefined
  style?: React.CSSProperties | undefined
  value?: any
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  selectOnChange?: (newValue: any, actionMeta: ActionMeta<unknown>) => void
}

export const Input = React.forwardRef(
  (
    {
      isSelect,
      isMulti = false,
      isCurrency = false,
      options = [],
      name,
      label,
      placeholder,
      required,
      error,
      autoFocus,
      type = 'text',
      value,
      style,
      onChange,
      selectOnChange,
      ...rest
    }: IInputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const LabelElement = !!label && (
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
    )

    if (isSelect) {
      return (
        <Container>
          {LabelElement}
          <Select
            styles={{
              control: (provided) => ({
                ...provided,
                boxShadow: 'none',
                border: `1px solid ${error ? 'red' : '#c9c9c9'}`,
                padding: 1,
                color: '#636363',
                marginTop: 9,
                marginBottom: 9,
                borderRadius: 6,
              }),
              placeholder: (provided) => ({
                ...provided,
                color: '#a8a8a8',
                fontSize: 13,
              }),
              input: (provided) => ({
                ...provided,
                ':focus': {
                  borderColor: error ? 'red' : '#4e7de5',
                  borderWidth: 1,
                  outline: 'none',
                },
              }),
            }}
            classNamePrefix="react-select"
            options={options}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={selectOnChange}
            isMulti={isMulti}
            {...rest}
          />
          {!!error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
      )
    }

    if (isCurrency) {
      return (
        <Container>
          {LabelElement}
          <CurrencyFormat
            name={name}
            value={value}
            autoFocus={autoFocus}
            decimalSeparator=","
            thousandSeparator="."
            prefix={'R$ '}
            placeholder="R$"
            onChange={onChange}
            customInput={CurrencyInput}
            {...rest}
          />
        </Container>
      )
    }

    return (
      <Container>
        {LabelElement}
        <StyledInput
          name={name}
          type={type}
          placeholder={placeholder}
          hasError={!!error || false}
          ref={ref}
          autoFocus={autoFocus}
          style={style}
          value={value}
          onChange={onChange}
          {...rest}
        />
        {!!error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    )
  }
)
