/// <reference path="../../typings/index.d.ts"/>
import gql from 'graphql-tag'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import Environment from '../Environment'

import { GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'

export const sendTest: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = (campaignId: number, deviceIds: string[]) => (
    dispatch: Dispatch<State>
): Promise<Action | void> => {
    const query: DocumentNode = gql`
        mutation SendTestCampaign($campaignId: Int!, $deviceIds: [String]) {
            sendTestCampaign(campaignId: $campaignId, deviceIds: $deviceIds)
        }
    `

    const request = {
        query,
        variables: {
            campaignId,
            deviceIds
        }
    }

    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                dispatch({
                    type: 'SEND_TEST_FAILURE',
                    message: errors[0].message
                })
                setTimeout(() => {
                    return dispatch({ type: 'DISMISS_FAILURE' })
                }, 4000)
            } else {
                return dispatch({
                    type: 'SEND_TEST_SUCCESS'
                })
            }
        },
        ({ result }) => {
            dispatch({
                type: 'SEND_TEST_FAILURE',
                message: result.errors[0].message
            })
            setTimeout(() => {
                return dispatch({ type: 'DISMISS_FAILURE' })
            }, 4000)
        }
    )
}
