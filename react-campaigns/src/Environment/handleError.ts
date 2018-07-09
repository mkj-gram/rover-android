/// <reference path="../../typings/index.d.ts"/>
import { Dispatch } from 'redux'

export default (
    actionType: string,
    dispatch: Dispatch<State>,
    message: string
): void => {
    dispatch({ type: actionType, message })
    setTimeout(() => dispatch({ type: 'DISMISS_FAILURE' }), 4000)

    if (
        message.includes('auth_context') ||
        message.includes('Unauthenticated') ||
        message.includes('Authorised')
    ) {
        window.location.replace('/auth/sign-in')
    }
}
