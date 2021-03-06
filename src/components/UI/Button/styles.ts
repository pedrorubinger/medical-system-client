import styled from 'styled-components'

import { TButtonColors, Theme } from '../../../utils/constants/theme'

interface IStyledButtonProps {
  width?: string | number
  color: TButtonColors
}

export const StyledButton = styled.button<IStyledButtonProps>`
  width: ${({ width }) => width || 'auto'};
  background-color: ${({ color }) => Theme.buttons[color].color};
  color: ${({ color }) => Theme.buttons[color].text};
  border: 1px solid ${({ color }) => Theme.buttons[color].border};
  transition: 0.7s;
  padding: 7px 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: ${({ color }) => Theme.buttons[color]?.hover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:disabled:hover {
    background-color: ${({ color }) => Theme.buttons[color].color};
  }
`
