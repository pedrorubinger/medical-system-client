import { useSelector } from 'react-redux'

import { PageContent } from '../../components/UI/PageContent'
import { RootState } from '../../store'
import { Message, Title } from './styles'

export const Home = (): JSX.Element => {
  const { data } = useSelector((state: RootState) => state.AuthReducer)
  const name = data?.name || 'Usuário'

  return (
    <PageContent>
      <Title>Seja bem-vindo(a), {name}</Title>
      <Message>
        Navegue por meio do menu à esquerda para começar a utilizar o sistema.
      </Message>
    </PageContent>
  )
}
