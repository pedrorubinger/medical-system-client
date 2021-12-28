import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import UserReducer from './ducks/user/reducer'
import UserSaga from './ducks/user/saga'

const rootReducer = combineReducers({
  UserReducer,
})
const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = compose
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(UserSaga)

export type RootState = ReturnType<typeof rootReducer>
export { store }
