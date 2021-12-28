import styled from 'styled-components'

import { Theme } from '../../../utils/constants/theme'

export const Container = styled.div`
  padding: 20px 25px;
  height: 70px;
  background-color: ${Theme.primary};
  display: flex;
  border-bottom: 2px solid #2e55aa;
`

export const LogoText = styled.h1`
  color: #fff;
  text-shadow: 1px 1px 1px #dce0ea;
  font-size: 25px;
  align-self: center;
  transition: 0.6s;
  font-family: 'Antic Slab', serif;
  cursor: default;

  &:hover {
    text-shadow: 1px 1px 1px #fff;
  }
`
