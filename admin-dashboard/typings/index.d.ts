import firebase from 'firebase'

type State = {
    readonly app: AppState
}

type AppState = {
    user: firebase.User
    login: LoginState
}

type LoginState = {
    isLoading: boolean
}

interface StringMap<T> {
    [x: string]: T
}
