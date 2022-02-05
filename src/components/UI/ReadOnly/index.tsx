import { Label } from '../Label'
import { FakeInput } from './styles'

interface IReadOnlyProps {
  value: string | number
  label?: string
  /** @default false */
  required?: boolean
}

export const ReadOnly = ({
  label,
  value,
  required = false,
}: IReadOnlyProps) => {
  return (
    <>
      {!!label && <Label required={required}>{label}</Label>}
      <FakeInput>{value}</FakeInput>
    </>
  )
}
