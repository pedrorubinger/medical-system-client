// import { FiSearch } from 'react-icons/fi'

import { Container } from './styles'
import { Input } from '../Input'
// import { Button } from '../Button'

export const SearchBar = () => {
  return (
    <Container>
      <Input
        name="searchPatient"
        style={{ padding: 10, borderRadius: 20, paddingLeft: 20 }}
        placeholder="Pesquisar paciente..."
      />
      {/* <SearchButtonContainer>
        <Button style={{ borderRadius: '50%' }}>
          <FiSearch color="white" />
        </Button>
      </SearchButtonContainer> */}
    </Container>
  )
}
