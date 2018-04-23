/// <reference path="../../typings/index.d.ts"/>
import { ActionCreator, Dispatch } from 'redux'
import { getEditableUIState } from '../reducers'
import { ThunkAction } from 'redux-thunk'

export const updateEditableUIState: ActionCreator<
    ThunkAction<void, State, void>
> = (newUIStateGroup: keyof editableUIState, newUIStateValue: UIStateField) => (
    dispatch: Dispatch<State>,
    getState: () => State
): void => {
    const state = getState()
    const editableUIState = getEditableUIState(state)

    const newEditableUIState = {
        ...editableUIState,
        [newUIStateGroup]: {
            ...editableUIState[newUIStateGroup],
            ...newUIStateValue
        }
    }

    dispatch({
        type: 'UPDATE_EDITABLE_UI_STATE',
        editableUIState: newEditableUIState
    })
}
