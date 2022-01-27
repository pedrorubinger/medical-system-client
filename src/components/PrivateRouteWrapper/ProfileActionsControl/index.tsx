import { BiChevronDown } from 'react-icons/bi'
import { Dropdown, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
  AvatarImage,
  Container,
  DropdownIconContainer,
  InfoContainer,
  NameContainer,
  Role,
  UserName,
} from './styles'
import avatar from '../../../assets/images/avatar.jpg'
import { RootState } from '../../../store'

export const ProfileActionsControl = () => {
  const { data } = useSelector((state: RootState) => state.AuthReducer)
  const name = (data?.name || 'Usuário').split(' ')[0]

  const getRole = () => {
    switch (data?.role) {
      case 'manager':
        return 'secretário(a)'
      case 'doctor':
        return 'médico(a)'
      case 'admin':
        return ''
      default:
        return ''
    }
  }

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

      <Menu.Item key="2">Sair</Menu.Item>
    </Menu>
  )

  return (
    <Container>
      <AvatarImage src={avatar} width={40} height={40} />

      <InfoContainer>
        <NameContainer>
          <UserName>{name}</UserName>

          <Dropdown overlay={DropdownMenu} align={{ offset: [0, -3] }}>
            <DropdownIconContainer>
              <BiChevronDown />
            </DropdownIconContainer>
          </Dropdown>
        </NameContainer>

        <Role>{getRole()}</Role>
      </InfoContainer>
    </Container>
  )
}
