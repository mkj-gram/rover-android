import { GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { Action, ActionCreator, AnyAction, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { State, Account } from '../../typings'
import Environment from '../Environment'
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
        return Environment(token, request).then(({ data, errors }) => {
            if (errors) {
                return dispatch({
                    type: 'FETCH_ACCOUNTS_FAILUREß'
                })
            } else {
                let accounts = null
                accounts = data.accounts.reduce(
                    (prev: Account, next: Account) => {
                        return { [next.id]: next, ...prev }
                    },
                    {}
                )

                return dispatch({
                    type: 'FETCH_CAMPAIGNS_SUCCESS',
                    accounts
                })
            }
        })
    })
}
