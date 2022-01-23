import { FiSearch } from 'react-icons/fi'

import { SearchBarContainer, SearchButton, SearchPatientInput } from './styles'

export const SearchBar = () => {
  return (
    <SearchBarContainer>
      <SearchPatientInput
        name="searchPatient"
        placeholder="Buscar paciente..."
      />
      <SearchButton
        type="button"
        title="Clique para buscar um paciente pelo seu nome">
        <FiSearch />
      </SearchButton>
    </SearchBarContainer>
  )
}
