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
  style?: React.CSSProperties | undefined
  onFetch: React.MouseEventHandler<HTMLButtonElement> | undefined
}

export const RefreshButton = ({
  children,
  isFetching = false,
  title = 'Clique para buscar a listagem mais atualizada',
  isFetchingTitle = 'Buscando dados...',
  disabled,
  style,
  onFetch,
  ...rest
}: IRefreshButtonProps) => {
  return (
    <Button
      color="white"
      title={isFetching ? isFetchingTitle : title}
      disabled={disabled || isFetching}
      style={style}
      onClick={onFetch}
      {...rest}>
      {children || 'Atualizar'} <FiRefreshCcw size={10} />
    </Button>
  )
}
