import { combineReducers } from 'redux'
import { State } from '../../typings'
import authentication, * as authenticationSelector from './authentication'

// Authentication
export const getIsUnauthorized = (state: State): boolean =>
    authenticationSelector.getIsUnauthorized(state.authentication)

export const getUser = (state: State) =>
    authenticationSelector.getUser(state.authentication)

export const getIsLoggedIn = (state: State) =>
    authenticationSelector.getIsLoggedIn(state.authentication)

export default combineReducers({
    authentication
})
