import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: fit-content;
`

export const Item = styled.div`
  &:not(:last-child) {
    margin-right: 12px;
  }
`
