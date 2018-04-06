/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction } from 'redux'

const isError = (
    state: StringMap<string | boolean> = {
        error: false,
        message: ''
    },
    action: AnyAction
): StringMap<string | boolean> => {
    if (action.type === 'DISMISS_FAILURE') {
        return {
            error: false,
            message: ''
        }
    }

    if (action.type.includes('FAILURE')) {
        return {
            error: true,
            message: action.message
        }
    }
    return state
}

export const getIsError = (state: ErrorState) => state

export default isError
