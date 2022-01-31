import { Tooltip } from 'antd'
import { FiCheckCircle, FiEdit, FiTrash } from 'react-icons/fi'

import { Container, Item } from './styles'

// type TTableActionsOptions = 'check' | 'edit' | 'delete'

// interface ITableActionsProps {
//   options?: TTableActionsOptions
// }

export const TableActions = () => {
  return (
    <Container>
      <Tooltip overlay="Hey">
        <Item>
          <FiCheckCircle color="green" cursor="pointer" size={18} />
        </Item>
      </Tooltip>

      <Tooltip overlay="Ho">
        <Item>
          <FiEdit color="orange" cursor="pointer" size={18} />
        </Item>
      </Tooltip>

      <Tooltip overlay="Let's go">
        <Item>
          <FiTrash color="red" cursor="pointer" size={18} />
        </Item>
      </Tooltip>
    </Container>
  )
}
