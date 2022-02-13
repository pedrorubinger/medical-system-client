import { Tooltip } from 'antd'
import { IconType } from 'react-icons'
import { FiCheckCircle, FiEdit, FiInfo, FiTrash } from 'react-icons/fi'

import { Container, Item } from './styles'

type TTableAction = 'check' | 'edit' | 'delete' | 'info'

interface ITableActionsOption {
  onClick: React.MouseEventHandler<HTMLDivElement>
  id: TTableAction
  /** @default '' */
  overlay?: string
  /** @default 18 */
  iconSize?: number
  disabled?: boolean | undefined
}

interface ITableActionsProps {
  options: ITableActionsOption[]
}

interface IIcon {
  id: TTableAction
  color: string
  icon: IconType
}

const Icons: IIcon[] = [
  { id: 'check', icon: FiCheckCircle, color: 'green' },
  { id: 'delete', icon: FiTrash, color: 'red' },
  { id: 'edit', icon: FiEdit, color: 'orange' },
  { id: 'info', icon: FiInfo, color: '#4074e5' },
]

export const TableActions = ({ options }: ITableActionsProps) => {
  return (
    <Container>
      {options.map((item) => {
        const Icon = Icons.find((icon: IIcon) => icon.id === item.id)

        return (
          <Tooltip key={item.id} overlay={item.overlay || ''}>
            <Item onClick={item.disabled ? undefined : item.onClick}>
              {Icon && (
                <Icon.icon
                  color={item.disabled ? 'grey' : Icon.color}
                  cursor={item.disabled ? 'default' : 'pointer'}
                  size={item.iconSize || 18}
                />
              )}
            </Item>
          </Tooltip>
        )
      })}
    </Container>
  )
}
