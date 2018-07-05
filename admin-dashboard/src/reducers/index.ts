import { AnyAction, combineReducers } from 'redux'
import { Account, State, StringMap } from '../../typings'
import accounts, * as accountsSelector from './accounts'
import authentication, * as authenticationSelector from './authentication'
import dashboard, * as dashboardSelector from './dashboard'

// Accounts
export const getAccount = (state: State, id: string): Account =>
    accountsSelector.getAccount(state.accounts, id)

export const getAllAccounts = (state: State): Account[] =>
    accountsSelector.getAllAccounts(state.accounts)

// Authentication
export const getIsAuthLoading = (state: State): boolean =>
    authenticationSelector.getIsAuthLoading(state.authentication)

export const getIsAuthenticated = (state: State): boolean =>
    authenticationSelector.getIsAuthenticated(state.authentication)

export const getIsUnauthorized = (state: State): boolean =>
    authenticationSelector.getIsUnauthorized(state.authentication)

export const getUser = (state: State) =>
    authenticationSelector.getUser(state.authentication)

// Dashboard
export const getActiveView = (state: State): string =>
    dashboardSelector.getActiveView(state.dashboard)

export const getIsFetching = (state: State): boolean =>
    dashboardSelector.getIsFetching(state.dashboard)

// Error
const isError = (
    state: StringMap<boolean | string> = {
        error: false,
        message: ''
    },
    action: AnyAction
) => {
    if (action.type === 'DISMISS_FAILURE') {
        return {
            error: false,
            message: ''
        }
    }
    if (action.type.includes('FAILURE')) {
        return {
            error: true,
            message: action.message
        }
    }
    return state
}

export default combineReducers({
    accounts,
    authentication,
    dashboard,
    isError
})
