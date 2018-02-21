/// <reference path="../../typings/index.d.ts"/>
import gql from 'graphql-tag'
import { Action, ActionCreator, Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import Environment from '../Environment'

import { GraphQLRequest } from 'apollo-link'
import { DocumentNode } from 'graphql'

export const fetchTestDevices: ActionCreator<
    ThunkAction<Promise<Action>, State, void>
> = () => (dispatch: Dispatch<State>): Promise<Action> => {
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
        ({ data }) => {
            let testDevices: StringMap<string> = {}
            // tslint:disable-next-line:no-any
            data.segmentFromPredicates.dataGridRows.forEach((elem: any) => {
                testDevices[
                    elem.filter(
                        // tslint:disable-next-line:no-any
                        (v: any) => v.attribute === 'device_id'
                    )[0].value
                    // tslint:disable-next-line:no-any
                ] = elem.filter((v: any) => v.attribute === 'label')[0].value
            })

            return dispatch({
                type: 'FETCH_TEST_DEVICES_SUCCESS',
                testDevices
            })
        },
        error => {
            return dispatch({
                type: 'FETCH_TEST_DEVICES_FAILURE',
                message: error.message
            })
        }
    )
}
