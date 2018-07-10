import { AnyAction, combineReducers } from 'redux'
import { DashboardState } from '../../typings'

const activeView = (state: string = 'accounts', action: AnyAction) => {
    switch (action.type) {
        case 'VIEW_ACCOUNTS':
            return 'accounts'
        case 'VIEW_CREATE_ACCOUNT':
            return 'create account'
        case 'VIEW_CREATE_USER':
            return 'create user'
        default:
            return state
    }
}

const isFetching = (state = false, action: AnyAction) => {
    switch (action.type) {
        case 'FETCH_ACCOUNTS_REQUEST':
            return true
        case 'FETCH_ACCOUNTS_SUCCESS':
        case 'FETCH_ACCOUNTS_FAILURE':
        default:
            return state
    }
}

export const getIsFetching = (state: DashboardState) => state.isFetching

export const getActiveView = (state: DashboardState) => state.activeView

export default combineReducers({
    activeView,
    isFetching
})
