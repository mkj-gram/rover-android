import firebase from 'firebase'

type State = {
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
}

interface StringMap<T> {
    [x: string]: T
}
