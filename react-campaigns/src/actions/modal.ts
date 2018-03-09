/// <reference path="../../typings/index.d.ts"/>

import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import Environment from '../Environment'
import * as H from 'history'
import { setTimeout } from 'timers'

export const handleAlertOptionsModalDisplay: ActionCreator<
    ThunkAction<void, State, void>
> = (deviceInfoSelected?: string) => (dispatch: Dispatch<State>): void => {
    if (deviceInfoSelected.length !== 0) {
        dispatch({
            type: 'SET_ALERT_OPTIONS_MODAL_OPEN',
            deviceInfoSelected
        })
    } else {
        dispatch({
            type: 'SET_ALERT_OPTIONS_MODAL_CLOSING',
            deviceInfoSelected: 'close'
        })
        setTimeout(() => {
            dispatch({
                type: 'SET_ALERT_OPTIONS_MODAL_CLOSED',
                deviceInfoSelected
            })
        }, 500)
    }
}

export const handleOverviewModalDisplay: ActionCreator<
    ThunkAction<void, State, void>
> = (history: H.History) => (dispatch: Dispatch<State>): void => {
    dispatch({
        type: 'SET_OVERVIEW_MODAL_CLOSE'
    })
    setTimeout(() => {
        history.push('/campaigns/')
        dispatch({
            type: 'SET_OVERVIEW_MODAL_OPEN'
        })
    }, 500)
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
