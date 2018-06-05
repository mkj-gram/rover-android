/// <reference path="../../typings/index.d.ts"/>
import gql from 'graphql-tag'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import Environment from '../Environment'
import handleError from '../Environment/handleError'

import { GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'

export const fetchTestDevices: ActionCreator<
    ThunkAction<Promise<Action | void>, State, void>
> = () => (dispatch: Dispatch<State>): Promise<Action | void> => {
    const query: DocumentNode = gql`
        query FetchTestDevices(
            $predicates: String!
            $pageNumber: Int
            $pageSize: Int
            $condition: String
        ) {
            segmentFromPredicates(
                predicates: $predicates
                pageNumber: $pageNumber
                pageSize: $pageSize
                condition: $condition
            ) {
                dataGridRows
                segmentSize
                totalSize
            }
        }
    `
    const request = {
        query: query,
        variables: {
            predicates:
                '[{"attribute":"is_test_device","booleanComparison":"is equal","selector":"DEVICE", \
            "booleanValue":true,"__typename":"BooleanPredicate","label":"Test Device?","options":[]}]',
            pageNumber: 0,
            pageSize: 150,
            condition: 'ANY'
        }
    }

    return Environment(request).then(
        ({ data, errors }) => {
            if (errors) {
                return handleError(
                    'FETCH_TEST_DEVICES_FAILURE',
                    dispatch,
                    errors[0].message
                )
            } else {
                let testDevices: StringMap<string> = {}
                // tslint:disable-next-line:no-any
                data.segmentFromPredicates.dataGridRows.forEach((elem: any) => {
                    testDevices[
                        elem.filter(
                            // tslint:disable-next-line:no-any
                            (v: any) => v.attribute === 'device_id'
                        )[0].value
                    ] = elem.filter(
                        // tslint:disable-next-line:no-any
                        (v: any) => v.attribute === 'label'
                    )[0].value
                })

                return dispatch({
                    type: 'FETCH_TEST_DEVICES_SUCCESS',
                    testDevices
                })
            }
        },
        ({ result }) =>
            handleError(
                'FETCH_TEST_DEVICES_FAILURE',
                dispatch,
                result.errors[0].message
            )
    )
}

export const updateSelectedTestDevices: ActionCreator<
    ThunkAction<void, State, void>
> = (deviceIds: string[]) => (dispatch: Dispatch<State>): void => {
    dispatch({
        type: 'UPDATE_SELECTED_TEST_DEVICES',
        deviceIds
    })
}
