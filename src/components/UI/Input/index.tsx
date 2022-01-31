import React from 'react'
import { GroupBase, StylesConfig } from 'react-select'

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
  selectStyles?:
    | StylesConfig<ISelectOptions, false, GroupBase<ISelectOptions>>
    | undefined
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
      selectStyles,
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
          <Select
            options={options}
            // styles={selectStyles}
            placeholder={placeholder}
            name={name}
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
