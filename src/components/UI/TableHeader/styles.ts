import styled from 'styled-components'

import { Button as CustomButton } from '../Button'

export const TableHeaderContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  justify-content: space-between;
`

export const Title = styled.h3`
  color: #727272;
  font-size: 20px;
  font-weight: 500;
  margin-right: 8px;
`

export const Button = styled(CustomButton)`
  font-size: 15px;
  display: flex;
  align-items: center;

  & svg {
    margin-left: 6px;
  }
`
