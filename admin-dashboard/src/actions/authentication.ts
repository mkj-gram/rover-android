import { User } from '@firebase/auth-types'
import firebase from 'firebase/app'
import 'firebase/auth'
import { ActionCreator, AnyAction, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { State } from '../../typings'

export const authenticate: ActionCreator<
    ThunkAction<void, State, void, AnyAction>
> = (user: User) => (dispatch: Dispatch<AnyAction>): void => {
    if (!user) {
        dispatch({
            type: 'USER_LOGOUT'
        })
        return
    }
    if (user.email.endsWith('@rover.io')) {
        dispatch({
            type: 'USER_LOGIN',
            user: user
        })
        dispatch({
            type: 'AUTHENTICATION_LOGIN'
        })
        return
    }
    firebase.auth().currentUser.delete()
    dispatch({
        type: 'AUTHENTICATION_UNAUTHORIZED'
    })
}

export const resetLogin: ActionCreator<
    ThunkAction<void, State, void, AnyAction>
> = () => (dispatch: Dispatch<AnyAction>): void => {
    dispatch({
        type: 'AUTHENTICATION_RESET'
    })
}
