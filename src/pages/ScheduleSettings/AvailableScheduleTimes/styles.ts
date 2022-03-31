import { Row } from 'antd'
import styled from 'styled-components'

import { Button as CustomButton } from '../../../components/UI/Button'

interface ICardProps {
  /** @default undefined */
  isSelected?: boolean | undefined
}

export const Form = styled.form``

export const InfoMessage = styled.h3`
  margin-bottom: 25px;
  color: #727272;
  line-height: 1.25;
  font-size: 14px;
  font-weight: 300;
`

export const ButtonRow = styled(Row)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

export const Button = styled(CustomButton)`
  margin-top: 22px;
  font-size: 14px;
  padding: 10px 15px;
  margin-left: 10px;
`

export const TimeBoard = styled.div`
  margin-top: 20px;
  background-color: #edf3f7;
  border: 1px solid #e1e9ef;
  box-shadow: 1px 1px 1px #d9dfe2;
  border-radius: 5px;
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  flex-wrap: wrap;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const Card = styled.div<ICardProps>`
  color: ${({ isSelected = false }) => (isSelected ? '#fff' : '#8e8e8e')};
  background-color: ${({ isSelected = false }) =>
    isSelected ? '#5edb8e' : '#fff'};
  border-radius: 5px;
  border: 1px solid
    ${({ isSelected = false }) => (isSelected ? '#53c67f' : '#d8d8d8')};
  padding: 12px 16px;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-right: 5px;
  margin-left: 5px;
  text-align: center;
  transition: 0.6s;
  cursor: pointer;

  &:hover {
    background-color: ${({ isSelected = false }) =>
      isSelected ? '#55cc81' : '#f7f7f7'};
  }
`
