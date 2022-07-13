import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { Button as CustomButton } from '../../components/UI/Button'
import { Theme } from '../../utils/constants/theme'

interface IStyledLinkStyles {
  /** @default 11.5 */
  fontSize?: number
}

export const Container = styled.div`
  min-height: 100vh;
  background-color: #f9f9f9;

  @media (max-width: 460px) {
    border: none;
    box-shadow: none;
    background-color: #fff;
  }
`

export const PassowrdRecoveryCard = styled.div`
  width: 35%;
  min-width: 400px;
  margin: auto;
  margin-top: 50px;
  background: #fff;
  border-radius: 7px;
  padding: 35px 30px;
  box-shadow: 2px 2px 6px -1px #d6d6d6;
  border: 1px solid #f7f7f7;

  @media (max-width: 460px) {
    border: none;
    box-shadow: none;
    width: 100%;
    min-width: 100%;
  }
`

export const PasswordRecoveryTitle = styled.h3`
  font-size: 25px;
  color: ${Theme.primary};
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 1px solid #dedee0;
  padding-bottom: 18px;
`

export const StyledLink = styled(Link)<IStyledLinkStyles>`
  color: ${Theme.primary};
  font-size: ${({ fontSize = 11.5 }) => fontSize}px;
  margin-top: 0px;

  &:not(:first-of-type) {
    margin-left: 14px;
  }
`

export const GetBackLinkContainer = styled.div`
  margin-top: 15px;
`

export const ButtonContainer = styled.div`
  margin-top: 30px;
  width: 100%;
`

export const Button = styled(CustomButton)`
  padding: 10px;
`

export const Form = styled.form``
