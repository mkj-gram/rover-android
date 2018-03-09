/// <reference path="../../typings/index.d.ts"/>
import gql from 'graphql-tag'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import Environment from '../Environment'

import { GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'
import { setTimeout } from 'timers'

export const createEditableCampaign: ActionCreator<
    ThunkAction<void, State, void>
> = (edCampaign: ScheduledCampaign | AutomatedNotificationCampaign) => (
    dispatch: Dispatch<State>
): void => {
    // Initialize UIState
    let editableCampaign:
        | ScheduledCampaign
        | AutomatedNotificationCampaign = edCampaign
    if (editableCampaign.UIState.length === 0) {
        editableCampaign = {
            ...edCampaign,
            UIState: JSON.stringify({
                notification: {
                    messageAndMedia: false,

                    alertOptions: false,
                    tapBehavior: false,
                    advancedSettings: false
                },
                showExperience: false
            })
        }
    }

    dispatch({
        type: 'CREATE_EDITABLE_CAMPAIGN',
        editableCampaign
    })
}

export const updateEditableCampaign: ActionCreator<
    ThunkAction<void, State, void>
> = (val: object) => (
    dispatch: Dispatch<State>,
    getState: () => State
): void => {
    const editableCampaign = {
        ...getState().editableCampaign,
        ...val
    }

    dispatch({
        type: 'UPDATE_EDITABLE_CAMPAIGN',
        editableCampaign
    })
}
