import styled from 'styled-components'

import { Button as CustomButton } from '../Button'

export const Button = styled(CustomButton)`
  padding: 6px 10px;
  font-size: 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;

  & svg {
    margin-left: 5px;
  }
`
