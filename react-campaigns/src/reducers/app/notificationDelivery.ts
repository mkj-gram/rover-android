/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const isNotificationDeliveryModalOpen = (
    state = 'close',
    action: AnyAction
) => {
    switch (action.type) {
        case 'OPEN_NOTIFICATION_DELIVERY_MODAL':
            return 'open'
        case 'CLOSE_NOTIFICATION_DELIVERY_MODAL':
            return 'close'
        case 'CLOSING_NOTIFICATION_DELIVERY_MODAL':
            return 'closing'
        default:
            return state
    }
}

const lastViewPage = (state = '', action: AnyAction) => {
    switch (action.type) {
        case 'UPDATE_LAST_VIEW_PAGE':
            return action.lastViewPage
        default:
            return state
    }
}

export default combineReducers({
    isNotificationDeliveryModalOpen,
    lastViewPage
})

export const getIsNotificationDeliveryModalOpen = (
    state: NotificationDeliveryState
) => state.isNotificationDeliveryModalOpen

export const getLastViewPage = (state: NotificationDeliveryState) =>
    state.lastViewPage
