import { Row, Typography } from 'antd'
import styled from 'styled-components'

import { Button } from '../../components/UI/Button'
import { Input } from '../../components/UI/Input'

export const InfoMessage = styled.h3`
  margin-bottom: 25px;
  color: #727272;
  line-height: 1.25;
  font-size: 14px;
  font-weight: 300;
`

export const CardsContainer = styled.div`
  display: grid;
  margin-top: 30px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 2px;
  width: 100%;

  > * {
    margin-bottom: 14px;
    margin-right: 15px;
  }
`

export const ReportCard = styled.div`
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 7px;
  padding: 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`

export const ReportCardTitle = styled(Typography)`
  color: #666666;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 10px;
`

export const ReportCardContent = styled(Typography)`
  color: grey;
  font-weight: 300;
  font-size: 13px;
`

export const SkeletonReportCard = styled.div`
  height: 70px;
  background-color: #fff;
  border: 1px solid #f4f4f4;
  border-radius: 6px;
  padding: 8px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`

export const SkeletonReportCardContent = styled.div`
  margin-top: 5px;
`

export const Form = styled.form``

export const SearchValuesRow = styled(Row)`
  margin-bottom: 0;
  padding-bottom: 0;
`

export const CustomInput = styled(Input)`
  font-size: 13px;
  padding: ${({ isSelect }) => (isSelect ? 0 : 12)}px;
  margin-bottom: 0;
`

export const CustomButton = styled(Button)`
  font-size: 15px;
  margin-top: 4px;
  padding-left: 16px;
  padding-right: 16px;
`
