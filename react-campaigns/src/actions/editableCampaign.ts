/// <reference path="../../typings/index.d.ts"/>
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { getCampaign } from '../reducers'

export const createEditableCampaign: ActionCreator<
    ThunkAction<void, State, void>
> = (campaignId: string) => (
    dispatch: Dispatch<State>,
    getState: () => State
): void => {
    const state = getState()
    const campaign = getCampaign(state, campaignId) as ScheduledCampaign
    // Initialize UIState
    const { UIState, ...rest } = campaign as ScheduledCampaign
    const parsedUIState =
        (UIState as string).length > 0 ? JSON.parse(UIState as string) : null
    dispatch({
        type: 'CREATE_EDITABLE_CAMPAIGN',
        editableCampaign: rest
    })
    dispatch({
        type: 'CREATE_EDITABLE_UI_STATE',
        editableUIState: {
            messageAndMedia: {
                seen: false,
                type: 'notification'
            },
            alertOptions: {
                seen: false,
                type: 'notification'
            },
            tapBehavior: {
                seen: false,
                type: 'notification'
            },
            advancedSettings: {
                seen: false,
                type: 'notification'
            },
            dateAndTime: {
                seen: false,
                type: 'scheduleddelivery'
            },
            audience: {
                seen: false,
                type: 'scheduleddelivery'
            },
            ...parsedUIState
        }
    })
}

export const updateEditableCampaign: ActionCreator<
    ThunkAction<void, State, void>
> = (campaignField: object) => (
    dispatch: Dispatch<State>,
    getState: () => State
): void => {
    const editableCampaign = {
        ...getState().editableCampaign,
        ...campaignField
    }

    dispatch({
        type: 'UPDATE_EDITABLE_CAMPAIGN',
        editableCampaign
    })
}
