import styled from 'styled-components'

interface ILabelProps {
  fontWeight?: 'bold' | 'normal'
}

export const StyledLabel = styled.label<ILabelProps>`
  color: #515151;
  font-size: 14px;
  font-weight: ${({ fontWeight }) => fontWeight || 'normal'};
`

export const RequiredMark = styled.span`
  color: red;
`
