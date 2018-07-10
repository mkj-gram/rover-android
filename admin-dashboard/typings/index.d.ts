import firebase, { messaging } from 'firebase'
import { SemanticCOLORS } from '../node_modules/semantic-ui-react'

type State = {
    readonly isToast: ToastState
    readonly accounts: StringMap<Account>
    readonly users: StringMap<number | User>
    readonly authentication: AuthState
    readonly dashboard: DashboardState
}

type AuthState = {
    isAuthLoading: boolean
    isAuthenticated: boolean
    isUnauthorizedUser: boolean
    user: firebase.User
}

type DashboardState = {
    error: ToastState
    activeView: string
    isFetching: boolean
}

interface Account {
    name: string
    accountname: string
    id: number
    createdAt: string
    updatedAt: string
}

interface User {
    id: number
    accountId: number
    name: string
    email: string
    permissionScopes: [string]
    createdAt: string
    updatedAt: string
}

interface ToastState {
    display: boolean
    message: string
    color: SemanticCOLORS
}

interface StringMap<T> {
    [x: string]: T
}
