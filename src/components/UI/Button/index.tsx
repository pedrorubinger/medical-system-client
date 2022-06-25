import React, { ButtonHTMLAttributes } from 'react'

import { TButtonColors } from '../../../utils/constants/theme'
import { StyledButton } from './styles'

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string | number
  /** @default 'primary' */
  color?: TButtonColors
  icon?: React.ReactNode
}

export const Button = React.forwardRef(
  (
    { children, width, color = 'primary', icon, ...rest }: IButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    const Icon = icon

    return (
      <StyledButton color={color} width={width} ref={ref} {...rest}>
        {children} {icon ? Icon : ''}
      </StyledButton>
    )
  }
)
