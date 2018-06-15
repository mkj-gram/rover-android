/// <reference path="../../typings/index.d.ts"/>
import gql from 'graphql-tag'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { DocumentNode } from 'graphql'
import Environment from '../Environment'
import handleError from '../Environment/handleError'
import { setTimeout } from 'timers'

import { getEditableCampaign } from '../reducers/index'

export const fetchSegments: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = () => (dispatch: Dispatch<State>): Promise<Action | void> => {
    dispatch({ type: 'FETCH_SEGMENTS_REQUEST' })
    const query: DocumentNode = gql`
        query Segments {
            dynamicSegment {
                segmentId
                name
            }
        }
    `
    const request = { query }
    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                return handleError(
                    'FETCH_SEGMENTS_FAILURE',
                    dispatch,
                    errors[0].message
                )
            }
            return dispatch({
                type: 'FETCH_SEGMENTS_SUCCESS',
                segments: data.dynamicSegment.reduce(
                    (segments: StringMap<Segment>, segment: Segment) => ({
                        ...segments,
                        [segment.segmentId]: segment
                    }),
                    {}
                )
            })
        },
        ({ result }) =>
            handleError(
                'FETCH_SEGMENTS_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}

export const fetchNextAudienceSize: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = (segmentIds: Array<string>) => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<Action | void> => {
    dispatch({ type: 'FETCH_NEXT_AUDIENCE_SIZE_REQUEST' })
    const query: DocumentNode = gql`
        query SegmentSize($segmentIds: [ID!]!, $condition: String!) {
            segmentSize(segmentIds: $segmentIds, condition: $condition)
        }
    `
    const state = getState()
    const { app, editableCampaign } = state
    const { segmentCondition } = editableCampaign

    const request = {
        query,
        variables: {
            segmentIds: segmentIds,
            condition: segmentCondition
        }
    }
    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                return handleError(
                    'FETCH_NEXT_AUDIENCE_FAILURE',
                    dispatch,
                    errors[0].message
                )
            }
            return dispatch({
                type: 'FETCH_NEXT_AUDIENCE_SIZE_SUCCESS',
                audience: {
                    ...getState().app.audience,
                    [segmentIds[0]]: data.segmentSize
                }
            })
        },
        ({ result }) =>
            handleError(
                'FETCH_NEXT_AUDIENCE_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}

export const fetchAudienceSize: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = () => (
    dispatch: Dispatch<State>,
    getState: () => State
): Promise<Action | void> => {
    dispatch({ type: 'FETCH_AUDIENCE_SIZE_REQUEST' })

    const state = getState()

    const query: DocumentNode = gql`
        query SegmentSize {
            totalSize: segmentSize(segmentIds: [], condition: "ANY")
        }
    `

    const request = {
        query
    }

    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                return handleError(
                    'FETCH_AUDIENCE_SIZE_FAILURE',
                    dispatch,
                    errors[0].message
                )
            }
            return dispatch({
                type: 'FETCH_AUDIENCE_SIZE_SUCCESS',
                audience: {
                    ...data
                }
            })
        },
        ({ result }) =>
            handleError(
                'FETCH_AUDIENCE_SIZE_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}

export const fetchAudienceSizes: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = () => (dispatch: Dispatch<State>, getState: () => State) => {
    dispatch({ type: 'FETCH_AUDIENCE_SIZE_REQUEST' })

    const state = getState()
    const { editableCampaign } = state
    const { segmentCondition, segmentIds } = editableCampaign

    const queriesById = segmentIds
        .map((id, index, array) => {
            const ids = array.slice(0, index + 1).reverse()
            return `x${id}: segmentSize(segmentIds: ${JSON.stringify(
                ids
            )}, condition: $condition)`
        })
        .concat([
            `totalSize: segmentSize(segmentIds: [], condition: $condition)`
        ])
        .join('\n')

    const query: DocumentNode = gql`
        query SegmentSize($condition: String!) {
            ${queriesById}
        }
    `

    const request = {
        query,
        variables: {
            condition: segmentCondition
        }
    }

    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                return handleError(
                    'FETCH_AUDIENCE_SIZE_FAILURE',
                    dispatch,
                    errors[0].message
                )
            }
            return dispatch({
                type: 'FETCH_AUDIENCE_SIZE_SUCCESS',
                audience: Object.keys(data).reduce(
                    (prev, curr) => ({
                        ...prev,
                        [curr === 'totalSize'
                            ? 'totalSize'
                            : curr.slice(1)]: data[curr]
                    }),
                    {}
                )
            })
        },
        ({ result }) =>
            handleError(
                'FETCH_AUDIENCE_SIZE_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}
