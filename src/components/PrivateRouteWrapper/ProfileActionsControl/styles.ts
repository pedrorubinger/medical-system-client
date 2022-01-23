import styled from 'styled-components'

export const Container = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  margin: auto 0;
`

export const UserName = styled.h3`
  color: grey;
  font-size: 14px;
  margin-right: 8px;
  font-weight: 300;
`

export const AvatarImage = styled.img`
  border-radius: 50%;
  margin-right: 8px;
`

/** This component is necessary to avoid the warning: "findDOMNode is deprecated in StrictMode" */
export const DropdownIconContainer = styled.div`
  cursor: pointer;
`
