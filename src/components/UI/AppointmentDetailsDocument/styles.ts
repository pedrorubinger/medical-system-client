import { Row, Spin } from 'antd'
import styled from 'styled-components'

import { Button as CustomButton } from '../Button'

export const ButtonsContainer = styled.div`
  margin-top: 30px;
  display: flex;
`

export const Button = styled(CustomButton)`
  padding-left: 18px;
  padding-right: 18px;
  font-size: 14px;
`

export const CheckboxRow = styled(Row)`
  margin-top: 9px;
`

export const CheckboxContainer = styled.div``

export const PreviewObject = styled.object`
  width: 100%;
  height: 50vh;
`

export const Embed = styled.embed``

export const PreviewTitle = styled.h2`
  color: #5e5e5e;
  font-size: 17px;
  margin-bottom: 10px;
`

export const Loader = styled(Spin)`
  color: #fff;
`
