// interface IProfileActionsControlProps {}

import { BiChevronDown } from 'react-icons/bi'
import { Dropdown, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
  AvatarImage,
  Container,
  DropdownIconContainer,
  UserName,
} from './styles'
import avatar from '../../../assets/images/avatar.jpg'
import { RootState } from '../../../store'

export const ProfileActionsControl = () => {
  const { data } = useSelector((state: RootState) => state.UserReducer)
  const name = (data?.name || 'Usuário').split(' ')[0]

  const DropdownMenu = (
    <Menu>
      <Menu.Item key="0">
        <Link rel="noopener noreferrer" to="/my-account">
          Minha Conta
        </Link>
      </Menu.Item>

      <Menu.Item key="1">
        <Link rel="noopener noreferrer" to="/help">
          Ajuda
        </Link>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item key="3">Sair</Menu.Item>
    </Menu>
  )

  return (
    <Container>
      <UserName>{name}</UserName>
      <AvatarImage src={avatar} width={40} height={40} />
      <Dropdown overlay={DropdownMenu} align={{ offset: [0, 10] }}>
        <DropdownIconContainer>
          <BiChevronDown />
        </DropdownIconContainer>
      </Dropdown>
    </Container>
  )
}
