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
    if ((campaign.UIState as string).length === 0) {
        const { UIState, ...rest } = campaign as ScheduledCampaign
        dispatch({
            type: 'CREATE_EDITABLE_CAMPAIGN',
            editableCampaign: {
                ...rest
            }
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
                }
            }
        })
    } else {
        const { UIState, ...rest } = campaign
        dispatch({
            type: 'CREATE_EDITABLE_CAMPAIGN',
            editableCampaign: rest
        })
        dispatch({
            type: 'CREATE_EDITABLE_UI_STATE',
            editableUIState: JSON.parse(UIState as string)
        })
    }
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
