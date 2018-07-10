import { GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { Action, ActionCreator, AnyAction, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { State } from '../../typings'
import Environment from '../Environment'
import handleToast from '../Environment/handleToast'
import { getUser } from '../reducers'

export const createUser: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void, AnyAction>
> = (accountId: number, name: string, email: string, password: string) => (
    dispatch: Dispatch<AnyAction>,
    getState: () => State
): Promise<Action | void> => {
    const query: DocumentNode = gql`
        mutation createUser(
            $accountId: Int!
            $name: String!
            $email: String!
            $password: String!
        ) {
            createUser(
                accountId: $accountId
                name: $name
                email: $email
                password: $password
            ) {
                id
                accountId
                name
                email
                permissionScopes
                createdAt
                updatedAt
            }
        }
    `
    const request: GraphQLRequest = {
        query: query,
        variables: {
            accountId,
            name,
            email,
            password
        }
    }

    const user = getUser(getState())
    return user
        .getIdToken()
        .then(token => {
            Environment(token, request).then(({ data, errors }) => {
                if (errors) {
                    handleToast(
                        'CREATE_USER_FAILURE',
                        dispatch,
                        errors[0].message
                    )
                } else {
                    const users = {
                        ...getState().users,
                        [data.createUser.id]: {
                            ...data.createUser
                        }
                    }
                    dispatch({
                        type: 'CREATE_USER_SUCCESS',
                        users
                    })
                }
                handleToast(
                    'CREATE_USER_SUCCESS_TOAST',
                    dispatch,
                    `Created user ${data.createUser.name} for account ${
                        data.createUser.accountId
                    }`
                )
            })
        })
        .catch(error => {
            handleToast(
                'NETWORK_FAILURE',
                dispatch,
                'Network error, please try again'
            )
        })
}
