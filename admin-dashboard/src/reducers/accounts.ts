import { AnyAction } from 'redux'
import { Account, StringMap } from '../../typings'

export default (
    state: StringMap<Account> = {},
    action: AnyAction
): StringMap<Account> | null => {
    if (action.accounts) {
        return {
            ...action.accounts
        }
    }
    return state
}

export const getAccount = (state: StringMap<Account>, id: string) =>
    state[id] || null

export const getAllAccounts = (state: StringMap<Account>): Array<Account> => {
    if (state && state.accounts) {
        return Object.keys(state).map(id => getAccount(state, id))
    }
    return []
}
