import { FiRefreshCcw } from 'react-icons/fi'
import { Button } from './styles'

interface IRefreshButtonProps {
  /** @default false */
  isFetching?: boolean | undefined
  /** @default 'Buscando dados...' */
  isFetchingTitle?: string | undefined
  /** @default 'Clique para buscar a listagem mais atualizada' */
  title?: string | undefined
  children?: React.ReactChildren
  disabled?: boolean
  onFetch: React.MouseEventHandler<HTMLButtonElement> | undefined
}

export const RefreshButton = ({
  children,
  isFetching = false,
  title = 'Clique para buscar a listagem mais atualizada',
  isFetchingTitle = 'Buscando dados...',
  disabled,
  onFetch,
}: IRefreshButtonProps) => {
  return (
    <Button
      color="white"
      title={isFetching ? isFetchingTitle : title}
      disabled={disabled || isFetching}
      onClick={onFetch}>
      {children || 'Atualizar'} <FiRefreshCcw size={10} />
    </Button>
  )
}
