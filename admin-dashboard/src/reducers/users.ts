import { AnyAction } from 'redux'
import { User, StringMap } from '../../typings'

export default (
    state: StringMap<User> = {},
    action: AnyAction
): StringMap<number | User> | null => {
    if (action.User) {
        return {
            ...action.User
        }
    }
    return state
}

export const getUsers = (state: StringMap<number | User>, accountId: string) =>
    state[accountId] || null
