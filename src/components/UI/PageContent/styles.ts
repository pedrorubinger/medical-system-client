import styled from 'styled-components'

interface IContainerProps {
  margin?: string
}

export const Container = styled.div<IContainerProps>`
  background-color: #fff;
  border: 1px solid #ededed;
  box-shadow: 1px 1px 2px #e0e0e0;
  padding: 25px;
  border-radius: 6px;
  margin: ${({ margin = 0 }) => margin};
`
