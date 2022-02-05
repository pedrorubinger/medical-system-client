import styled from 'styled-components'
import ReactSelect from 'react-select'

interface IStyledInputProps {
  hasError?: boolean
}

export const Container = styled.div`
  margin: 7px 0;
`

export const StyledInput = styled.input<IStyledInputProps>`
  padding: 9px;
  padding-left: 10px;
  border-radius: 6px;
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  margin: 9px 0;
  border: 1px solid ${({ hasError }) => (hasError ? 'red' : '#c9c9c9')};
  transition: 0.6s;
  background: #fff;
  color: #636363;
  /* box-shadow: 0px 1px 1px #c9c9c9; */

  &:focus {
    border-color: ${({ hasError }) => (hasError ? 'red' : '#4e7de5')};
    border-width: 1px;
    outline: none;
  }

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #a8a8a8;
    font-size: 13px;
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #a8a8a8;
    font-size: 13px;
  }
`

export const ErrorMessage = styled.span`
  font-size: 13px;
  color: red;
  margin: 8px 0;
`

export const Select = styled(ReactSelect)<IStyledInputProps>`
  /* padding: 8px;
  padding-left: 10px;
  border-radius: 6px;
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  margin: 9px 0;
  border: 1px solid ${({ hasError }) => (hasError ? 'red' : '#c9c9c9')};
  transition: 0.6s;
  background: #fff;
  color: #636363; */
  /* box-shadow: 0px 1px 1px #c9c9c9; */
`
