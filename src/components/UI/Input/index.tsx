import React from 'react'
import Select from 'react-select'
import { Label } from '../Label'

import { Container, ErrorMessage, StyledInput } from './styles'

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
          {/* TO DO: IMPROVE AND TEST... */}
          <Select options={options} placeholder={placeholder} name={name} />
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
          onChange={onChange}
          {...rest}
        />
        {!!error && <ErrorMessage>{error}</ErrorMessage>}
      </Container>
    )
  }
)
