import firebase from 'firebase'

type State = {
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
    activeTab: string
    isFetching: boolean
}

interface Account {
    name: string
    id: number
    createdAt: string
    updatedAt: string
}

interface StringMap<T> {
    [x: string]: T
}
