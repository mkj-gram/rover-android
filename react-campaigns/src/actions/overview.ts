/// <reference path="../../typings/index.d.ts"/>

import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'

import * as H from 'history'
import { setTimeout } from 'timers'

export const handleOpenOverviewModalDisplay: ActionCreator<
    ThunkAction<void, State, void>
> = () => (dispatch: Dispatch<State>): void => {
    dispatch({
        type: 'TRIGGERED_ANIMATION',
        trigger: ''
    })
    dispatch({
        type: 'OPEN_OVERVIEW_MODAL'
    })
}

export const handleCloseOverviewModalDisplay: ActionCreator<
    ThunkAction<void, State, void>
> = (history: H.History, path: string) => (dispatch: Dispatch<State>): void => {
    dispatch({
        type: 'TRIGGERED_ANIMATION',
        trigger: ''
    })
    dispatch({
        type: 'CLOSING_OVERVIEW_MODAL'
    })
    setTimeout(() => {
        history.push(path)
    }, 325)
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
