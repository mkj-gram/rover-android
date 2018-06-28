import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { Action, ActionCreator, AnyAction, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { State } from '../../typings'
import Environment from '../Environment'

export const fetchAccounts: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void, AnyAction>
> = () => (dispatch: Dispatch<AnyAction>): Promise<Action | void> => {
    return
}
