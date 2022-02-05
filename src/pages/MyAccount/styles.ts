import { Row } from 'antd'
import styled from 'styled-components'

import { Button as CustomButton } from '../../components/UI/Button'

export const Form = styled.form``

export const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`

export const Button = styled(CustomButton)`
  padding: 10px 15px;
  font-size: 14px;
  margin-top: 15px;
`

export const CheckboxRow = styled(Row)`
  margin-top: 10px;
`
