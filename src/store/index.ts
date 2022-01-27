import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import AuthReducer from './ducks/auth/reducer'
import AuthSaga from './ducks/auth/saga'
import UserReducer from './ducks/user/reducer'
import UserSaga from './ducks/user/saga'

const rootReducer = combineReducers({
  AuthReducer,
  UserReducer,
})
const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = compose
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(AuthSaga)
sagaMiddleware.run(UserSaga)

export type RootState = ReturnType<typeof rootReducer>
export { store }
