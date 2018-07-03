import { AnyAction, combineReducers } from 'redux'
import { DashboardState } from '../../typings'

const activeTab = (state: string = 'dashboard', action: AnyAction) => {
    switch (action.type) {
        case 'TAB_DASHBOARD':
            return 'dashboard'
        case 'TAB_CREATE_ACCOUNT':
            return 'create account'
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

export const getActiveTab = (state: DashboardState) => state.activeTab

export default combineReducers({
    activeTab,
    isFetching
})
