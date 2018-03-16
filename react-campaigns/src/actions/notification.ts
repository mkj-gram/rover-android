/// <reference path="../../typings/index.d.ts"/>

import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'

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
