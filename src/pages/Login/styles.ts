import { Link } from 'react-router-dom'
import styled from 'styled-components'
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

export const SignInCard = styled.div`
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
export const LoginTitle = styled.h3`
  font-size: 25px;
  color: ${Theme.primary};
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 1px solid #dedee0;
  padding-bottom: 18px;
`

export const LoginExtraInfoContainer = styled.div`
  text-align: right;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: 1180px) {
    flex-direction: column;
  }
`

export const StyledLink = styled(Link)`
  color: ${Theme.primary};
  font-size: 13px;
  margin-top: 5px;

  &:not(:first-of-type) {
    margin-left: 14px;
  }
`

export const ButtonContainer = styled.div`
  margin-top: 30px;
  width: 100%;
`
