import { Component } from 'react'

import { StyledInput } from './styles'

/**
 * The library react-currency-format there's an issue (fires an warning) when using a custom input component.
 * It's possible to suppress the prop-type warning by wrapping your styled-component in a class component.
 */
export class CurrencyInput extends Component {
  render() {
    return <StyledInput {...this.props} />
  }
}
