import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { audienceClient } from '../grpcClients'
promisify(audienceClient)

import { GraphQLID, GraphQLList, GraphQLString, GraphQLInt } from 'graphql'
import DynamicSegment from './DynamicSegment'
import { getSegmentPageById } from './SegmentRowsQuery'

import { getSegment } from './mockSegments'

const getSelectorName = selector => {
   const selectEnum = {
       0: 'CUSTOM_PROFILE',
       1: 'DEVICE',
       2: 'ROVER_PROFILE'
   }

   return selectEnum[selector]
}

const DynamicSegmentQuery = {
    type: new GraphQLList(DynamicSegment),
    args: {
        segmentId: {
            type: GraphQLID
        },
        pageNumber: {
            type: GraphQLInt
        },
        pageSize: {
            type: GraphQLInt
        }
    },
    resolve: async (
        _,
        { segmentId, pageNumber, pageSize },
        { authContext }
    ) => {
        const getDevicesFromGrpc = async () => {
            const request = new RoverApis.audience.v1.Models
                .ListDynamicSegmentsRequest()
            request.setAuthContext(authContext)

            const response = await audienceClient.listDynamicSegments(request)

            return response.getSegmentsList().map(segment => ({
                segmentId: segment.getId(),
                name: segment.getTitle()
            }))
        }

        const GetDynamicSegmentByIdFromGrpc = async () => {
            const request = new RoverApis.audience.v1.Models.GetDynamicSegmentByIdRequest()
            request.setAuthContext(authContext)
            request.setSegmentId(segmentId)
            const response = await audienceClient.getDynamicSegmentById(request)

            const segment = response.getSegment()
            
            const unpackStringPredicate = predicate => {
                // IS_UNSET        = 0;
                // IS_SET          = 1;
                // 
                // IS_EQUAL        = 2;
                // IS_NOT_EQUAL    = 3;
                // 
                // STARTS_WITH  = 4;
                // ENDS_WITH    = 5;
                // 
                // CONTAINS     = 6;
                // DOES_NOT_CONTAIN = 7;
                
                const stringComparisons = {
                    0: 'is unset',
                    1: 'is set',
                    2: 'is',
                    3: 'is not',
                    4: 'starts with',
                    5: 'ends with',
                    6: 'contains',
                    7: 'does not contain'
                }
                const pred = predicate.getStringPredicate()

                return {
                    attribute: pred.getAttributeName(),
                    selector: getSelectorName(predicate.getSelector()),
                    stringComparison: stringComparisons[pred.getOp()],
                    stringValue: pred.getValue(),
                    // include __typename field expected by DynamicSegment
                    __typename: 'StringPredicate'
                }
            }
            
            const unpackBoolPredicate = predicate => {
                // IS_UNSET    = 0;
                // IS_SET      = 1;
                // 
                // IS_EQUAL   = 2;
                
                const boolComparisons = {
                    0: 'is unset',
                    1: 'is set',
                    2: 'is equal'
                }
                const pred = predicate.getBoolPredicate()
                return {
                    attribute: pred.getAttributeName(),
                    selector: getSelectorName(predicate.getSelector()),
                    booleanComparison: boolComparisons[pred.getOp()],
                    booleanValue: pred.getValue(),
                    __typename: 'BooleanPredicate'
                }
            }
            
            const unpackNumberPredicate = predicate => {
                // IS_UNSET        = 0;
                // IS_SET          = 1;
                // 
                // IS_EQUAL        = 2;
                // IS_NOT_EQUAL    = 3;
                // 
                // IS_GREATER_THAN = 4;
                // IS_LESS_THAN    = 5;
                // 
                // IS_BETWEEN      = 6;
                
                const numberComparisons = {
                    0: 'is unset',
                    1: 'is set',
                    2: 'is equal',
                    3: 'is not equal',
                    4: 'is greater than',
                    5: 'is less than',
                    6: 'is between'
                }
                const pred = predicate.getNumberPredicate()
                return {
                    attribute: pred.getAttributeName(),
                    selector: getSelectorName(predicate.getSelector()),
                    numberComparison: numberComparisons[pred.getOp()],
                    numberValue: [pred.getValue(), pred.getValue2()],
                    __typename: 'NumberPredicate'
                }
            }
            
            const unpackDoublePredicate = predicate => {
                // IS_UNSET        = 0;
                // IS_SET          = 1;
                // 
                // IS_EQUAL        = 2;
                // IS_NOT_EQUAL    = 3;
                // 
                // IS_GREATER_THAN = 4;
                // IS_LESS_THAN    = 5;
                // 
                // IS_BETWEEN      = 6;
                
                const doubleComparisons = {
                    0: 'is unset',
                    1: 'is set',
                    2: 'is equal',
                    3: 'is not equal',
                    4: 'is greater than',
                    5: 'is less than',
                    6: 'is between'
                }
                const pred = predicate.getDoublePredicate()
                return {
                    attribute: pred.getAttributeName(),
                    selector: getSelectorName(predicate.getSelector()),
                    numberComparison: doubleComparisons[pred.getOp()],
                    numberValue: [pred.getValue(), pred.getValue2()],
                    __typename: 'FloatPredicate'
                }
            }
            
            const unpackDatePredicate = predicate => {
                // IS_UNSET        = 0;
                // IS_SET          = 1;
                // 
                // IS_EQUAL        = 2;
                // IS_NOT_EQUAL    = 3;
                // 
                // IS_GREATER_THAN = 4;
                // IS_LESS_THAN    = 5;
                // 
                // IS_BETWEEN      = 6;
                // 
                // IS_AFTER        = 7;
                // IS_BEFORE       = 8;
                // IS_ON           = 9;
                
                const dateComparisons = {
                    0: 'is unset',
                    1: 'is set',
                    2: 'is equal',
                    3: 'is not equal',
                    4: 'is greater than',
                    5: 'is less than',
                    6: 'is between',
                    7: 'is after',
                    8: 'is before',
                    9: 'is on'
                }
                const pred = predicate.getDatePredicate()
                return {
                    attribute: pred.getAttributeName(),
                    selector: getSelectorName(predicate.getSelector()),
                    dateComparison: dateComparisons[pred.getOp()],
                    dateValue: {
                        start: RoverApis.Helpers.timestampFromProto(pred.getValue()),
                        end: RoverApis.Helpers.timestampFromProto(pred.getValue2())
                    },
                    __typename: 'DatePredicate'
                }
            }
            
            const unpackGeofencePredicate = predicate => {
                // IS_UNSET   = 0;
                // IS_SET     = 1;
                // 
                // IS_OUTSIDE = 2;
                // IS_WITHIN  = 3;
                
                const geofenceComparisons = {
                    0: 'is unset',
                    1: 'is set',
                    2: 'is outside',
                    3: 'is within'
                }
                
                const pred = predicate.getGeofencePredicate()
                const predLocation = pred.getValue()
                return {
                    attribute: pred.getAttributeName(),
                    selector: getSelectorName(predicate.getSelector()),
                    geofenceComparison: geofenceComparisons[pred.getOp()],
                    geofenceValue: {
                        longitude: predLocation.getLongitude(),
                        latitude: predLocation.getLatitude(),
                        radius: predLocation.getRadius(),
                        name: predLocation.getName(),
                    },
                    __typename: 'GeofencePredicate'
                }
            }
            
            const unpackVersionPredicate = predicate => {
                // IS_UNSET                 = 0;
                // IS_SET                   = 1;
                // 
                // IS_EQUAL                 = 2;
                // IS_NOT_EQUAL             = 3;
                // 
                // IS_GREATER_THAN          = 4;
                // IS_LESS_THAN             = 5;
                // 
                // IS_BETWEEN               = 6;
                // 
                // IS_GREATER_THAN_OR_EQUAL = 7;
                // IS_LESS_THAN_OR_EQUAL    = 8;
                
                const versionComparisons = {
                    0: 'is unset',
                    1: 'is set',
                    2: 'is equal',
                    3: 'is not equal',
                    4: 'is greater than',
                    5: 'is less than',
                    6: 'is between',
                    7: 'is greater than or equal',
                    8: 'is less than or equal'
                }
                
                const pred = predicate.getVersionPredicate()
                const value = pred.getValue()
                const value2 = pred.getValue2()
                return {
                    attribute: pred.getAttributeName(),
                    selector: getSelectorName(predicate.getSelector()),
                    versionComparison: versionComparisons[pred.getOp()],
                    versionValue: [
                        value.getMajor(),
                        value.getMinor(),
                        value.getRevision(),
                        value2.getMajor(),
                        value2.getMinor(),
                        value2.getRevision()
                    ],
                    __typename: 'VersionPredicate'
                }
            }

            const unpackStringArrayPredicate = predicate => {
                // IS_UNSET                 = 0;
                // IS_SET                   = 1;
            
                // CONTAINS_ANY             = 2;
                // DOES_NOT_CONTAIN_ANY     = 3;
            
                // CONTAINS_ALL            = 4;
                // DOES_NOT_CONTAIN_ALL    = 5;
                const stringArrayComparisons = {
                    0: 'is unset',
                    1: 'is set',
                    2: 'contains any',
                    3: 'does not contain any',
                    4: 'contains all',
                    5: 'does not contain all'
                }
                const pred = predicate.getStringArrayPredicate()
                return {
                    attribute: pred.getAttributeName(),
                    selector: getSelectorName(predicate.getSelector()),
                    stringArrayComparison: stringArrayComparisons[pred.getOp()],
                    stringArrayValue: pred.getValueList(),
                    __typename: 'StringArrayPredicate'
                }
            }

            const predicateList = segment.getPredicateAggregate().getPredicatesList().map(predicate => {
                switch (predicate.getValueCase()) {
                    case 2:
                        return unpackStringPredicate(predicate)
                        break
                    case 3:
                        return unpackBoolPredicate(predicate)
                        break
                    case 4:
                        return unpackNumberPredicate(predicate)
                        break
                    case 5:
                        return unpackDatePredicate(predicate)
                        break
                    case 6:
                        return unpackVersionPredicate(predicate)
                        break
                    case 7:
                        return unpackGeofencePredicate(predicate)
                        break
                    case 8:
                        return unpackFloatPredicate(predicate)
                        break
                    case 9:
                        return unpackStringArrayPredicate(predicate)
                        break
                }
            })

            const condition = segment.getPredicateAggregate().getCondition() === 0 ? 'ANY' : 'ALL'
            return [{
                segmentId: segment.getId(),
                name: segment.getTitle(),
                predicateList,
                condition,
                pageNumber,
                pageSize
            }]

        }

        if (!segmentId) {
            return await getDevicesFromGrpc()
        }

        return await GetDynamicSegmentByIdFromGrpc()
    }
}

export default DynamicSegmentQuery
