/// <reference path="../../typings/index.d.ts"/>
import { AnyAction, combineReducers } from 'redux'

const reports = (
    state: StringMap<NotificationOpenedByDateReport> = {},
    action: AnyAction
): StringMap<NotificationOpenedByDateReport> | null => {
    if (action.reportConnection) {
        return action.reportConnection.reports
    }

    return state
}

const months: StringMap<string> = {
    '01': 'JAN',
    '02': 'FEB',
    '03': 'MAR',
    '04': 'APR',
    '05': 'MAY',
    '06': 'JUN',
    '07': 'JUL',
    '08': 'AUG',
    '09': 'SEP',
    '10': 'OCT',
    '11': 'NOV',
    '12': 'DEC'
}

const pageInfo = (state: PageInfo = {}, action: AnyAction) => {
    if (action.reportConnection) {
        return action.reportConnection.pageInfo
    }

    return state
}

export default combineReducers({
    pageInfo,
    reports
})

export const getFormattedReport = (state: ReportConnection) => {
    return Object.keys(state.reports).map(key => {
        const { id, notificationCenter } = state.reports[key]
        return {
            name: `${months[id.substr(5, 2)]} ${id.substr(8, 2)}`,
            value: notificationCenter
        }
    })
}

export const getReport = (state: StringMap<NotificationOpenedByDateReport>) =>
    state

export const getReportHasNextPage = (state: ReportConnection) => {
    return state.pageInfo.hasNextPage
}

export const getReportHasPreviousPage = (state: ReportConnection) => {
    return state.pageInfo.hasPreviousPage
}
export const getReportStartCursor = (state: ReportConnection) => {
    return state.pageInfo.startCursor
}
export const getReportEndCursor = (state: ReportConnection) => {
    return state.pageInfo.endCursor
}
