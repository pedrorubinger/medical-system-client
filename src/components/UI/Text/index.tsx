import { StyledText } from './styles'

interface ITextProps {
  value: string | React.ReactChild
}

export const Text = ({ value }: ITextProps) => {
  return <StyledText>{value}</StyledText>
}
