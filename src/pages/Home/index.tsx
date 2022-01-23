import { useSelector } from 'react-redux'

import { PageContent } from '../../components/UI/PageContent'
import { RootState } from '../../store'
import { Message, Title } from './styles'

export const Home = (): JSX.Element => {
  const { data } = useSelector((state: RootState) => state.UserReducer)
  const name = data?.name || 'Usuário'

  return (
    <PageContent>
      <Title>Seja bem-vindo, {name}</Title>
      <Message>
        Navegue por meio do menu para começar a utilizar o sistema.
      </Message>
    </PageContent>
  )
}
