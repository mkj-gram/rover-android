/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const activePopover = (state = '', action: AnyAction): string => {
    if (action.type === 'UPDATE_ACTIVE_POPOVER') {
        return action.field
    }
    return state
}

const isPopoverModalFormOpen = (state = 'close', action: AnyAction) => {
    switch (action.type) {
        case 'OPEN_POPOVER_MODAL_FORM':
            return 'open'
        case 'CLOSE_POPOVER_MODAL_FORM':
            return 'close'
        case 'CLOSING_POPOVER_MODAL_FORM':
            return 'closing'
        default:
            return state
    }
}

export default combineReducers({
    activePopover,
    isPopoverModalFormOpen
})

export const getActivePopover = (state: PopoverState) => state.activePopover

export const getIsPopoverModalFormOpen = (state: PopoverState) =>
    state.isPopoverModalFormOpen
