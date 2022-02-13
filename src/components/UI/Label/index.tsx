import { RequiredMark, StyledLabel } from './styles'

interface ILabelProps {
  children: React.ReactNode
  htmlFor?: string
  required?: boolean
  /** @default 'normal' */
  fontWeight?: 'bold' | 'normal'
}

export const Label = ({
  children,
  fontWeight,
  htmlFor,
  required,
}: ILabelProps) => {
  return (
    <StyledLabel htmlFor={htmlFor} fontWeight={fontWeight}>
      {children} {!!required && <RequiredMark>*</RequiredMark>}
    </StyledLabel>
  )
}
