import { User } from '@firebase/auth-types'
import * as authenticationActions from './authentication'

// Authentication
export const authenticate = (user: User) =>
    authenticationActions.authenticate(user)

export const resetLogin = () => authenticationActions.resetLogin()
