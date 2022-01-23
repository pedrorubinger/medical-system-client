import styled from 'styled-components'

export const Container = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  margin: auto 0;
`

export const NameContainer = styled.div`
  display: flex;
`

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const Role = styled.h4`
  color: grey;
  font-size: 10px;
  font-weight: 100;
  margin-top: 2px;
  display: block;
`

export const UserName = styled.h3`
  color: #6c6c6d;
  font-size: 15px;
  margin-right: 4px;
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
