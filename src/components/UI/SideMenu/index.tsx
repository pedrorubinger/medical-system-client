import { useWindowDimensions } from '../../../hooks/useWindowDimensions'
import { Container, TopBar } from './styles'

export const mobileLimitWidth = 1100

export const SideMenu = () => {
  const { width } = useWindowDimensions()

  if (!width) {
    return <Container />
  }

  if (width > mobileLimitWidth) {
    return <Container />
  }

  return <TopBar />
}
