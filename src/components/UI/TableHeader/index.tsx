import { FiPlusCircle } from 'react-icons/fi'

import { Button, TableHeaderContainer, Title } from './styles'

interface INewRecordButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  visible: boolean
  disabled?: boolean
  /** @default 'Cadastrar' */
  value?: string
  /** @default 'Clique para cadastrar um novo registro' */
  title?: string
}

interface ITableHeaderProps {
  title: string
  newRecordButton?: INewRecordButtonProps | undefined
  margin?: string | undefined
}

export const TableHeader = ({
  title,
  margin,
  newRecordButton,
}: ITableHeaderProps): JSX.Element => {
  return (
    <TableHeaderContainer>
      <Title margin={margin}>{title}</Title>
      {!!newRecordButton?.visible && (
        <Button
          disabled={newRecordButton?.disabled}
          onClick={newRecordButton.onClick}
          color="new"
          type="button"
          title={
            newRecordButton?.title || 'Clique para cadastrar um novo registro'
          }>
          {newRecordButton?.value || 'Cadastrar'}
          <FiPlusCircle size={17} />
        </Button>
      )}
    </TableHeaderContainer>
  )
}
