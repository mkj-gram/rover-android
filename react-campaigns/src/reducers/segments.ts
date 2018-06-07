/// <reference path="../../typings/index.d.ts"/>
import { AnyAction } from 'redux'
import { getEditableCampaign } from './index'

export default (
    state: StringMap<string> = {},
    action: AnyAction
): StringMap<string> => {
    if (action.segments) {
        return {
            ...action.segments
        }
    }
    return state
}

export const getSegment = (
    state: StringMap<Segment>,
    segmentId: string
): Segment => state[segmentId] || null

export const getAllSegments = (state: StringMap<Segment>): Array<Segment> => {
    if (state) {
        return Object.keys(state).map((segmentId: string) =>
            getSegment(state, segmentId)
        )
    }
}

export const getUnselectedSegments = (state: State): Array<Segment> => {
    const { segmentIds } = state.editableCampaign
    return getAllSegments(state.segments).filter(
        ({ segmentId }) => !segmentIds.includes(segmentId)
    )
}
