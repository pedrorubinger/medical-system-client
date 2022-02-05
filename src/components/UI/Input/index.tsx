import React from 'react'

import { Label } from '../Label'
import { Container, ErrorMessage, Select, StyledInput } from './styles'

interface ISelectOptions {
  value: string | number
  label: string
}

interface IInputProps {
  name: string
  isSelect?: boolean | undefined
  autoFocus?: boolean | undefined
  /** @default [] */
  options?: ISelectOptions[]
  label?: string | undefined
  /** @default 'text' */
  type?: React.HTMLInputTypeAttribute | undefined
  htmlFor?: string | undefined
  required?: boolean | undefined
  placeholder?: string | undefined
  error?: string | undefined
  style?: React.CSSProperties | undefined
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
}

export const Input = React.forwardRef(
  (
    {
      isSelect,
      options = [],
      name,
      label,
      placeholder,
      required,
      error,
      autoFocus,
      type = 'text',
      style,
      onChange,
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
          />
          {!!error && <ErrorMessage>{error}</ErrorMessage>}
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
          hasError={!!error}
          ref={ref}
          autoFocus={autoFocus}
          style={style}
          onChange={onChange}
          {...rest}
        />
        {!!error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    )
  }
)
