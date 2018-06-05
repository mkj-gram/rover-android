/// <reference path="../../../typings/index.d.ts"/>
import { AnyAction } from 'redux'

export default (
    state: AudienceState = {},
    action: AnyAction
): AudienceState => {
    if (action.audience) {
        return action.audience
    }
    return state
}

export const getAggregateAudienceSize = (
    state: AudienceState,
    segmentId: string
): number | false => state[segmentId] || false

export const getAudience = (state: AudienceState) => state

export const getTotalAudienceSize = (state: AudienceState): number | false =>
    state.totalSize || false
