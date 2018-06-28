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

export const getActiveTab = (state: DashboardState) => state.activeTab

export default combineReducers({
    activeTab
})
