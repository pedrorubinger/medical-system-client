import { Router } from './router'

const consoleError = console.error.bind(console)

console.error = (errObj, ...args) => {
  if (
    process.env.NODE_ENV === 'development' &&
    (typeof errObj === 'string' || typeof errObj.message === 'string') &&
    args.includes('findDOMNode')
  ) {
    return
  }
  consoleError(errObj, ...args)
}

const App = (): JSX.Element => {
  return <Router />
}

export default App
