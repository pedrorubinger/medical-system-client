import { RequiredMark, StyledLabel } from './styles'

interface ILabelProps {
  children: React.ReactNode
  htmlFor?: string
  required?: boolean
}

export const Label = ({ children, htmlFor, required }: ILabelProps) => {
  return (
    <StyledLabel htmlFor={htmlFor}>
      {children} {!!required && <RequiredMark>*</RequiredMark>}
    </StyledLabel>
  )
}
