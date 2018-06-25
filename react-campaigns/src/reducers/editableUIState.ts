/// <reference path="../../typings/index.d.ts"/>

import { AnyAction } from 'redux'

export default (
    state: editableUIState | {} = {},
    action: AnyAction
): editableUIState | {} => {
    if (action.editableUIState) {
        return { ...action.editableUIState }
    }
    return state
}

export const getEditableUIState = (state: State) => state.editableUIState
