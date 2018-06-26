import firebase from 'firebase'

type State = {
    readonly authentication: AuthState
}

type AuthState = {
    isLoggedin: boolean
    isUnauthorizedUser: boolean
    user: firebase.User
}

interface StringMap<T> {
    [x: string]: T
}
