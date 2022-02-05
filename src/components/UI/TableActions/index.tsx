import { Tooltip } from 'antd'
import { IconType } from 'react-icons'
import { FiCheckCircle, FiEdit, FiTrash } from 'react-icons/fi'

import { Container, Item } from './styles'

type TTableAction = 'check' | 'edit' | 'delete'

interface ITableActionsOption {
  onClick: React.MouseEventHandler<HTMLDivElement>
  id: TTableAction
  /** @default '' */
  overlay?: string
  /** @default 18 */
  iconSize?: number
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
  { id: 'edit', icon: FiEdit, color: 'orange' },
  { id: 'delete', icon: FiTrash, color: 'red' },
]

export const TableActions = ({ options }: ITableActionsProps) => {
  return (
    <Container>
      {options.map((item) => {
        const Icon = Icons.find((icon: IIcon) => icon.id === item.id)

        return (
          <Tooltip key={item.id} overlay={item.overlay || ''}>
            <Item onClick={item.onClick}>
              {Icon && (
                <Icon.icon
                  color={Icon.color}
                  cursor="pointer"
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
