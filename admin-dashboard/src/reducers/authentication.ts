import { User } from '@firebase/auth-types'
import { AnyAction, combineReducers } from 'redux'
import { AuthState } from '../../typings'

const isLoggedin = (state: boolean = false, action: AnyAction) => {
    switch (action.type) {
        case 'AUTHENTICATION_LOGIN':
            return true
        case 'AUTHENTICATION_LOGOUT':
            return false
        default:
            return state
    }
}

const user = (state: User = null, action: AnyAction) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return action.user
        case 'USER_LOGOUT':
            return null
        default:
            return state
    }
}

const isUnauthorizedUser = (state: boolean = false, action: AnyAction) => {
    switch (action.type) {
        case 'AUTHENTICATION_UNAUTHORIZED':
            return true
        case 'AUTHENTICATION_RESET':
            return false
        default:
            return state
    }
}

export const getIsLoggedIn = (state: AuthState) => state.isLoggedin
export const getUser = (state: AuthState) => state.user
export const getIsUnauthorized = (state: AuthState) => state.isUnauthorizedUser

export default combineReducers({
    isLoggedin,
    user,
    isUnauthorizedUser
})
