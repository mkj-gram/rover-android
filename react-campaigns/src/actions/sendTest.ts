/// <reference path="../../typings/index.d.ts"/>
import gql from 'graphql-tag'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import Environment from '../Environment'

import { GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'

export const sendTest: ActionCreator<
    ThunkAction<Promise<Action>, State, void>
> = (campaignId: number, deviceIds: string[]) => (
    dispatch: Dispatch<State>
): Promise<Action> => {
    const query: DocumentNode = gql`
        mutation SendTest($campaignId: Int!, $deviceIds: [String]) {
            sendTest(campaignId: $campaignId, deviceIds: $deviceIds)
        }
    `

    const request = {
        query,
        variables: {
            campaignId,
            deviceIds
        }
    }

    return Environment(request).then(({ data, errors }) => {
        if (errors) {
            return dispatch({
                type: 'SEND_TEST_FAILURE',
                message: errors.message
            })
        } else {
            return dispatch({
                type: 'SEND_TEST_SUCCESS'
            })
        }
    })
}
