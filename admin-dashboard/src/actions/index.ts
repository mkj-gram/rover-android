import { User } from '@firebase/auth-types'
import * as accountActions from './accounts'
import * as authenticationActions from './authentication'
import * as dashboardActions from './dashboard'

// Authentication
export const authenticate = (user: User) =>
    authenticationActions.authenticate(user)

export const resetLogin = () => authenticationActions.resetLogin()

// Dashboard
export const viewSwitch = (view: string) => dashboardActions.viewSwitch(view)

// Accounts
export const fetchAccounts = () => accountActions.fetchAccounts()

export const createAccount = (name: string, accountname: string) =>
    accountActions.createAccount(name, accountname)
