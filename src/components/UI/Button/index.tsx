import React, { ButtonHTMLAttributes } from 'react'

import { TButtonColors } from '../../../utils/constants/theme'
import { StyledButton } from './styles'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width?: string | number
  /** @default 'primary' */
  color?: TButtonColors
}

export const Button = React.forwardRef(
  (
    { children, width, color = 'primary', ...rest }: IButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <StyledButton color={color} width={width} ref={ref} {...rest}>
        {children}
      </StyledButton>
    )
  }
)
