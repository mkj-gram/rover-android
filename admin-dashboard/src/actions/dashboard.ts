import { ActionCreator, AnyAction, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { State } from '../../typings'

export const tabSwitch: ActionCreator<
    ThunkAction<void, State, void, AnyAction>
> = (tab: string) => (dispatch: Dispatch<AnyAction>): void => {
    if (tab === 'dashboard') {
        dispatch({
            type: 'TAB_DASHBOARD'
        })
    }
    if (tab === 'create account') {
        dispatch({
            type: 'TAB_CREATE_ACCOUNT'
        })
    }
}
