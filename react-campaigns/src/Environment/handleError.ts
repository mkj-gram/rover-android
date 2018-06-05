/// <reference path="../../typings/index.d.ts"/>
import { Dispatch } from 'redux'

export default (
    actionType: string,
    dispatch: Dispatch<State>,
    message: string
): void => {
    dispatch({ type: actionType, message })
    setTimeout(() => dispatch({ type: 'DISMISS_FAILURE' }), 4000)
}
