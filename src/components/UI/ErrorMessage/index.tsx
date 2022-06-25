import { StyledErrorMessage } from './styles'

interface IErrorMessageProps {
  msg: string | JSX.Element
  style?: React.CSSProperties | undefined
  mt?: number | string | undefined
  mb?: number | string | undefined
}

export const ErrorMessage = ({ msg, mb, mt, style }: IErrorMessageProps) => {
  return (
    <StyledErrorMessage style={style} mt={mt} mb={mb}>
      {msg}
    </StyledErrorMessage>
  )
}
