import styled from 'styled-components'

interface IStyledErrorMessageProps {
  /** @default 0 */
  mb?: string | number | undefined
  /** @default 0 */
  mt?: string | number | undefined
}

export const StyledErrorMessage = styled.span<IStyledErrorMessageProps>`
  font-size: 13px;
  color: red;
  margin: 8px 0;
  margin-top: ${({ mt = 0 }) => (Number(mt) ? `${mt}px` : mt)};
  margin-bottom: ${({ mb = 0 }) => (Number(mb) ? `${mb}px` : mb)};
`
