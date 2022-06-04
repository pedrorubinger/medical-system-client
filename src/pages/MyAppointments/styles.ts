import styled from 'styled-components'

import { Button as CustomButton } from '../../components/UI/Button'

export const InfoMessage = styled.h3`
  margin-bottom: 25px;
  color: #727272;
  line-height: 1.25;
  font-size: 14px;
  font-weight: 300;
`

export const ButtonContainer = styled.div`
  display: flex;
`

export const Button = styled(CustomButton)`
  margin-top: 5px;
  padding-left: 18px;
  padding-right: 18px;
  font-size: 14px;
`
