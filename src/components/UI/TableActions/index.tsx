import { Tooltip } from 'antd'
import { IconType } from 'react-icons'
import {
  FiCheckCircle,
  FiEdit,
  FiInfo,
  FiPlusCircle,
  FiRepeat,
  FiTrash,
  FiUsers,
} from 'react-icons/fi'

import { Container, Item } from './styles'

type TTableAction =
  | 'add'
  | 'check'
  | 'edit'
  | 'delete'
  | 'info'
  | 'repeat'
  | 'users'

interface ITableActionsOption {
  onClick: React.MouseEventHandler<HTMLDivElement>
  id: TTableAction
  /** @default '' */
  overlay?: string
  /** @default 18 */
  iconSize?: number
  disabled?: boolean | undefined
  disabledTitle?: string | undefined
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
  { id: 'add', icon: FiPlusCircle, color: '#249966' },
  { id: 'check', icon: FiCheckCircle, color: 'green' },
  { id: 'delete', icon: FiTrash, color: 'red' },
  { id: 'edit', icon: FiEdit, color: 'orange' },
  { id: 'info', icon: FiInfo, color: '#4074e5' },
  { id: 'repeat', icon: FiRepeat, color: '#5058b2' },
  { id: 'users', icon: FiUsers, color: '#00b2a6' },
]

export const TableActions = ({ options }: ITableActionsProps) => {
  return (
    <Container>
      {options.map((item) => {
        const Icon = Icons.find((icon: IIcon) => icon.id === item.id)

        return (
          <Tooltip
            key={item.id}
            overlay={
              item.disabled ? item.disabledTitle || '' : item.overlay || ''
            }>
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
