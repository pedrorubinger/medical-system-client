import styled from 'styled-components'
import { Input } from '../Input'

export const Container = styled.div`
  width: 25%;
  min-width: 220px;
  height: fit-content;
  margin-bottom: 12px;
  margin-top: 2px;
  display: flex;
  align-items: center;
`

export const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
`

export const SearchButton = styled.button`
  background: #6bbaef;
  border: 1px solid #59aae0;
  border-left: none;
  color: #fff;
  padding: 8px 10px;
  height: 36.5px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  cursor: pointer;
  transition: 0.7s;

  &:hover {
    background: #4fa0d6;
  }
`

export const SearchPatientInput = styled(Input)`
  box-shadow: none;
  padding: 8px;
  padding-left: 12px;
  border-radius: 0;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  background: #f8f8f8;
  border-color: #f2f2f2;
  color: grey;
  height: 36.5px;

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #3d3d3d;
    font-size: 13px;
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #3d3d3d;
    font-size: 13px;
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #3d3d3d;
    font-size: 13px;
  }
`
