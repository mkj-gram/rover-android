import { combineReducers } from 'redux'
import { State } from '../../typings'
import authentication, * as authenticationSelector from './authentication'
import dashboard, * as dashboardSelector from './dashboard'

// Authentication
export const getIsAuthLoading = (state: State) =>
    authenticationSelector.getIsAuthLoading(state.authentication)

export const getIsAuthenticated = (state: State) =>
    authenticationSelector.getIsAuthenticated(state.authentication)

export const getIsUnauthorized = (state: State): boolean =>
    authenticationSelector.getIsUnauthorized(state.authentication)

export const getUser = (state: State) =>
    authenticationSelector.getUser(state.authentication)

// Dashboard
export const getActiveTab = (state: State) =>
    dashboardSelector.getActiveTab(state.dashboard)

export default combineReducers({
    authentication,
    dashboard
})
