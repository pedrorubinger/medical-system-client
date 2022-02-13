import { Label } from '../Label'
import { FakeInput, Text } from './styles'

interface IReadOnlyProps {
  value: string | number
  label?: string
  /** @default false */
  paperMode?: boolean
  /** @default false */
  required?: boolean
}

export const ReadOnly = ({
  label,
  value,
  required = false,
  paperMode = false,
}: IReadOnlyProps) => {
  if (paperMode) {
    return (
      <>
        {!!label && (
          <Label fontWeight="bold" required={required}>
            {label}
          </Label>
        )}
        <Text>{value}</Text>
      </>
    )
  }

  return (
    <>
      {!!label && <Label required={required}>{label}</Label>}
      <FakeInput>{value}</FakeInput>
    </>
  )
}
