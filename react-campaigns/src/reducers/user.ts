/// <reference path="../../typings/index.d.ts"/>
import { AnyAction } from 'redux'

export default (
    state: User = {
        userName: '',
        userEmail: '',
        accountName: ''
    },
    action: AnyAction
): User | null => {
    if (action.type === 'FETCH_USER_SUCCESS') {
        return action.user
    }

    return state
}

export const getUser = (state: User) => state
