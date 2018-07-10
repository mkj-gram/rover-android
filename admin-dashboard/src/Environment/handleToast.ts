import { AnyAction, Dispatch } from 'redux'

export default (
    actionType: string,
    dispatch: Dispatch<AnyAction>,
    message: string
): void => {
    dispatch({ type: actionType, message })
    setTimeout(() => dispatch({ type: 'DISMISS_FAILURE' }), 4000)

    if (
        message.includes('Unauthorized') ||
        message.includes('Auth error') ||
        message.includes('verified rover.io') ||
        message.includes('has expired')
    ) {
        window.location.replace('/login')
    }
}
