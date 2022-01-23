import { useWindowDimensions } from '../../../hooks/useWindowDimensions'
import { Container, TopBar } from './styles'

export const mobileLimitWidth = 1100

export const SideMenu = () => {
  const { width } = useWindowDimensions()

  if (!width || width >= mobileLimitWidth) {
    return <Container>hey</Container>
  }

  return <TopBar />
}
