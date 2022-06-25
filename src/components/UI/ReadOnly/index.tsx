import { Label } from '../Label'
import { Text } from '../Text'
import { FakeInput } from '../FakeInput'

interface IReadOnlyProps {
  value: string | number | JSX.Element
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
        <Text value={value} />
      </>
    )
  }

  return (
    <>
      {!!label && <Label required={required}>{label}</Label>}
      <FakeInput value={value} />
    </>
  )
}
