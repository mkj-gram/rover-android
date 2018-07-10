import { GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { Action, ActionCreator, AnyAction, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { Account, State } from '../../typings'
import Environment from '../Environment'
import handleToast from '../Environment/handleToast'
import { getUser } from '../reducers'

export const fetchAccounts: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void, AnyAction>
> = () => (
    dispatch: Dispatch<AnyAction>,
    getState: () => State
): Promise<Action | void> => {
    dispatch({ type: 'FETCH_ACCOUNTS_REQUEST' })
    const query: DocumentNode = gql`
        query {
            accounts {
                name
                accountname
                id
                createdAt
                updatedAt
            }
        }
    `
    const request: GraphQLRequest = {
        query: query
    }

    const user = getUser(getState())
    return user.getIdToken().then(token => {
        Environment(token, request)
            .then(({ data, errors }) => {
                if (errors) {
                    return handleToast(
                        'FETCH_ACCOUNTS_FAILURE',
                        dispatch,
                        errors[0].message
                    )
                } else {
                    let accounts = null
                    accounts = data.accounts.reduce(
                        (prev: Account, next: Account) => {
                            return { [next.id]: next, ...prev }
                        },
                        {}
                    )

                    return dispatch({
                        type: 'FETCH_ACCOUNTS_SUCCESS',
                        accounts
                    })
                }
            })
            .catch(error => {
                handleToast(
                    'NETWORK_FAILURE',
                    dispatch,
                    'Network error, please try again'
                )
            })
    })
}

export const createAccount: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void, AnyAction>
> = (name: string, accountname: string) => (
    dispatch: Dispatch<AnyAction>,
    getState: () => State
): Promise<Action | void> => {
    const query: DocumentNode = gql`
        mutation createAccount($name: String!, $accountname: String!) {
            createAccount(name: $name, accountname: $accountname) {
                name
                accountname
                id
                createdAt
                updatedAt
            }
        }
    `
    const request: GraphQLRequest = {
        query: query,
        variables: {
            name,
            accountname
        }
    }

    const user = getUser(getState())
    return user
        .getIdToken()
        .then(token => {
            Environment(token, request).then(({ data, errors }) => {
                if (errors) {
                    handleToast(
                        'CREATE_ACCOUNT_FAILURE',
                        dispatch,
                        errors[0].message
                    )
                } else {
                    const accounts = {
                        ...getState().accounts,
                        [data.createAccount.id]: {
                            ...data.createAccount
                        }
                    }
                    dispatch({
                        type: 'CREATE_ACCOUNT_SUCCESS',
                        accounts
                    })
                }
                handleToast(
                    'CREATE_ACCOUNT_SUCCESS_TOAST',
                    dispatch,
                    `Created account: ${data.createAccount.name}`
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
