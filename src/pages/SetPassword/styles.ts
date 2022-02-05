import styled from 'styled-components'

import { Button as CustomButton } from '../../components/UI/Button'
import { Theme } from '../../utils/constants/theme'

export const Container = styled.div`
  min-height: 100vh;
  background-color: #f9f9f9;

  @media (max-width: 460px) {
    border: none;
    box-shadow: none;
    background-color: #fff;
  }
`

export const SetPasswordCard = styled.div`
  width: 40%;
  min-width: 450px;
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

export const Form = styled.form``

export const Title = styled.h3`
  font-size: 25px;
  color: ${Theme.primary};
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 1px solid #dedee0;
  padding-bottom: 18px;
`

export const ButtonContainer = styled.div`
  margin-top: 30px;
  width: 100%;
`

export const Button = styled(CustomButton)`
  padding: 10px;
`
