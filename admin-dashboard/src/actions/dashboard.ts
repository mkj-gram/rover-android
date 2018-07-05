import { ActionCreator, AnyAction, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { State } from '../../typings'

export const viewSwitch: ActionCreator<
    ThunkAction<void, State, void, AnyAction>
> = (view: string) => (dispatch: Dispatch<AnyAction>): void => {
    if (view === 'accounts') {
        dispatch({
            type: 'VIEW_ACCOUNTS'
        })
    }
    if (view === 'create account') {
        dispatch({
            type: 'VIEW_CREATE_ACCOUNT'
        })
    }
}
