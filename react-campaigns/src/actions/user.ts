/// <reference path="../../typings/index.d.ts"/>
import gql from 'graphql-tag'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import Environment from '../Environment'
import handleError from '../Environment/handleError'

import { DocumentNode } from 'graphql'

export const fetchUser: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = () => (dispatch: Dispatch<State>): Promise<Action | void> => {
    const query: DocumentNode = gql`
        query User {
            user {
                name
                email
                account {
                    name
                }
            }
        }
    `
    const request = {
        query
    }
    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                return handleError(
                    'FETCH_USER_FAILURE',
                    dispatch,
                    errors[0].message
                )
            } else {
                const { user } = data
                const { name, email, account } = user

                return dispatch({
                    type: 'FETCH_USER_SUCCESS',
                    user: {
                        userName: name,
                        userEmail: email,
                        accountName: account.name
                    }
                })
            }
        },
        ({ result }) =>
            handleError(
                'FETCH_USER_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}
