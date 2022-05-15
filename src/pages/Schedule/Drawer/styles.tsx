import styled from 'styled-components'
import { Button as AntdButton, Row } from 'antd'

import { Button as CustomButton } from '../../../components/UI/Button'

export const Form = styled.form``

export const Button = styled(CustomButton)`
  margin-top: 15px;
  width: 100%;
  font-size: 14px;
`

export const LinkButton = styled(AntdButton)`
  margin: 0;
  padding-left: 0;
  padding-top: 0;
  font-size: 12px;
`

export const InfoMessage = styled.h3`
  margin-top: 10px;
  margin-bottom: 25px;
  padding-bottom: 10px;
  color: #727272;
  font-size: 13px;
  font-weight: 300;
  border-bottom: 1px solid #d8d8d8;
`

export const CheckboxRow = styled(Row)`
  margin: 10px 0;
`
