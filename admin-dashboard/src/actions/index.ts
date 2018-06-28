import { User } from '@firebase/auth-types'
import * as authenticationActions from './authentication'
import * as dashboardActions from './dashboard'
import * as accountActions from './accounts'

// Authentication
export const authenticate = (user: User) =>
    authenticationActions.authenticate(user)

export const resetLogin = () => authenticationActions.resetLogin()

// Dashboard
export const tabSwitch = (tab: string) => dashboardActions.tabSwitch(tab)

// Accounts
export const fetchAccounts = () => accountActions.fetchAccounts()
