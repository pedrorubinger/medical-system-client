import styled from 'styled-components'

import { Button as CustomButton } from '../Button'

interface ITitleProps {
  margin?: string
}

export const TableHeaderContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`

export const Title = styled.h3<ITitleProps>`
  color: #727272;
  font-size: 20px;
  font-weight: 500;
  margin-right: 8px;
  margin: ${({ margin }) => margin};
`

export const Button = styled(CustomButton)`
  font-size: 15px;
  display: flex;
  align-items: center;

  & svg {
    margin-left: 6px;
  }
`
