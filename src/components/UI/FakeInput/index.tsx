import { StyledFakeInput } from './styles'

interface IFakeInputProps {
  value: string | number | JSX.Element
  style?: React.CSSProperties | undefined
}

export const FakeInput = ({ value, style }: IFakeInputProps) => {
  return <StyledFakeInput style={style}>{value}</StyledFakeInput>
}
