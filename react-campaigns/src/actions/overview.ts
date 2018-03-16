/// <reference path="../../typings/index.d.ts"/>

import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'

import * as H from 'history'
import { setTimeout } from 'timers'

export const handleOverviewModalDisplay: ActionCreator<
    ThunkAction<void, State, void>
> = (history: H.History, open: boolean) => (
    dispatch: Dispatch<State>
): void => {
    if (open) {
        dispatch({
            type: 'OPEN_OVERVIEW_MODAL'
        })
    } else {
        dispatch({
            type: 'CLOSE_OVERVIEW_MODAL'
        })
        setTimeout(() => {
            history.push('/campaigns/')
        }, 500)
    }
}

export const handleSendTestModalDisplay: ActionCreator<
    ThunkAction<void, State, void>
> = (on: boolean) => (dispatch: Dispatch<State>): void => {
    if (on) {
        dispatch({
            type: 'SET_SEND_TEST_MODAL_OPEN'
        })
    } else {
        dispatch({
            type: 'SET_SEND_TEST_MODAL_CLOSE'
        })
    }
}
