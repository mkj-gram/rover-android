import firebase from 'firebase'

type State = {
    readonly isError: ErrorState
    readonly accounts: StringMap<Account>
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
    error: ErrorState
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

type ErrorState = StringMap<boolean | string>

interface StringMap<T> {
    [x: string]: T
}
