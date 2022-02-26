import { BiChevronDown } from 'react-icons/bi'
import { Dropdown, Menu } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

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
import { getTranslatedRole } from '../../../utils/helpers/roles'
import { Creators } from '../../../store/ducks/auth/reducer'

export const ProfileActionsControl = () => {
  const { data } = useSelector((state: RootState) => state.AuthReducer)
  const name = (data?.name || 'Usuário').split(' ')[0]
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logout = () => {
    localStorage.clear()
    dispatch(Creators.clearSignIn())
    navigate('/login')
  }

  const DropdownMenu = (
    <Menu>
      <Menu.Item key="0">
        <Link rel="noopener noreferrer" to="/my-account">
          Meus Dados
        </Link>
      </Menu.Item>

      <Menu.Item key="1">
        <Link rel="noopener noreferrer" to="/help">
          Ajuda
        </Link>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item key="2" onClick={logout}>
        Sair
      </Menu.Item>
    </Menu>
  )

  const getRole = () => {
    const role = getTranslatedRole(data?.role)

    if (data.is_admin) {
      return `${role} / admin`
    }

    return role
  }

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
