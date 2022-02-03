import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import AuthReducer from './ducks/auth/reducer'
import AuthSaga from './ducks/auth/saga'

const rootReducer = combineReducers({
  AuthReducer,
})
const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = compose
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(AuthSaga)

export type RootState = ReturnType<typeof rootReducer>
export { store }
