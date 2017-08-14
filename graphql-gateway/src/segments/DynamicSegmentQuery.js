import { GraphQLID, GraphQLList, GraphQLString, GraphQLInt } from 'graphql'
import DynamicSegment from './DynamicSegment'
import {getSegmentPageById} from './SegmentRowsQuery'



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
    resolve(_, { segmentId, pageNumber, pageSize}) {
        if (!segmentId) {
            return [
                {
                    segmentId: '123abc',
                    name: 'Toronto Users',
                    pageNumber: pageNumber,
                    pageSize: pageSize
                },
                {
                    segmentId: '456def',
                    name: 'iOS Users',
                    pageNumber: pageNumber,
                    pageSize: pageSize
                },
                {
                    segmentId: '789hij',
                    name: 'recent installations',
                    pageNumber: pageNumber,
                    pageSize: pageSize
                },
                {
                    segmentId: '101112klm',
                    name: 'Stadium visitors',
                    pageNumber: pageNumber,
                    pageSize: pageSize
                }
            ]
        }

        const mockPredicateData = {
            '123abc': [{
                'segmentId': '123abc',
                pageNumber,
                pageSize,
                name: 'Toronto Users',
                    predicates: {
                        device: [
                            {
                                attribute: 'hardware',
                                stringValue: 'iPhone 3G',
                                stringComparison: 'is'
                            },
                            {
                                attribute: 'SDKVersion',
                                versionValue: [4,0,0],
                                versionComparison: 'greater than or equal'
                            },
                            {
                                attribute: 'bluetoothOn',
                                booleanValue: false,
                                booleanComparison: 'false'
                            },
                            {
                                attribute: 'lastSeen',
                                dateValue: {
                                    start: new Date().toISOString(),
                                    end: new Date().toISOString(),
                                },
                                dateComparison: 'before'
                            }
                        ],
                        profile: [
                            {
                                attribute: 'age',
                                numberValue: [20],
                                numberComparison: 'less than'
                            },
                            {
                                attribute: 'first name',
                                stringValue: 'Alex',
                                stringComparison: 'is'
                            },
                            {
                                attribute: 'last location',
                                geofenceValue: {
                                    latitude: 43.651018,
                                    longitude: -79.375593,
                                    radius: 100,
                                    name: 'Toronto'
                                },
                                geofenceComparison: 'is within'
                            }
                        ],
                        condition: 'any'
                    }
            }],
            '456def': [{
                'segmentId': '456def',
                 pageNumber: pageNumber,
                pageSize: pageSize,
                name: 'iOS Users',
                    predicates: {
                        device: [
                            {
                                attribute: 'hardware',
                                stringValue: 'iPhone 4',
                                stringComparison: 'is'
                            },
                            {
                                attribute: 'SDKVersion',
                                versionValue: [2,0,0],
                                versionComparison: 'greater than or equal'
                            },
                            {
                                attribute: 'bluetoothOn',
                                booleanValue: true,
                                booleanComparison: 'true'
                            },
                            {
                                attribute: 'lastSeen',
                                dateValue: {
                                    start: new Date().toISOString(),
                                    end: new Date().toISOString(),
                                },
                                dateComparison: 'before'
                            }
                        ],
                        profile: [
                            {
                                attribute: 'age',
                                numberValue: [32],
                                numberComparison: 'less than'
                            },
                            {
                                attribute: 'first name',
                                stringValue: 'Will',
                                stringComparison: 'is'
                            },
                            {
                                attribute: 'last location',
                                geofenceValue: {
                                    latitude: 43.651018,
                                    longitude: -79.375593,
                                    radius: 100,
                                    name: 'Toronto'
                                },
                                geofenceComparison: 'is within'
                            }
                        ],
                        condition: 'any'
                    }
            }],
            '789hij': [{
                'segmentId': '789hij',
                 pageNumber: pageNumber,
                pageSize: pageSize,
                name: 'recent installations',
                    predicates: {
                        device: [
                            {
                                attribute: 'hardware',
                                stringValue: 'iPhone 3GS',
                                stringComparison: 'is'
                            },
                            {
                                attribute: 'SDKVersion',
                                versionValue: [1,0,0],
                                versionComparison: 'greater than or equal'
                            },
                            {
                                attribute: 'bluetoothOn',
                                booleanValue: true,
                                booleanComparison: 'true'
                            },
                            {
                                attribute: 'lastSeen',
                                dateValue: {
                                    start: new Date().toISOString(),
                                    end: new Date().toISOString(),
                                },
                                dateComparison: 'before'
                            }
                        ],
                        profile: [
                            {
                                attribute: 'age',
                                numberValue: [25],
                                numberComparison: 'less than'
                            },
                            {
                                attribute: 'first name',
                                stringValue: 'Chris',
                                stringComparison: 'is'
                            },
                            {
                                attribute: 'last location',
                                geofenceValue: {
                                    latitude: 43.651018,
                                    longitude: -79.375593,
                                    radius: 100,
                                    name: 'Toronto'
                                },
                                geofenceComparison: 'is within'
                            }
                        ],
                        condition: 'any'
                    }
            }],
            '101112klm': [{
                'segmentId': '101112klm',
                 pageNumber: pageNumber,
                pageSize: pageSize,
                name: 'Stadium visitors',
                    predicates: {
                        device: [
                            {
                                attribute: 'bluetoothOn',
                                booleanValue: false,
                                booleanComparison: 'false'
                            }
                        ],
                        profile: [
                            {
                                attribute: 'age',
                                numberValue: [15],
                                numberComparison: 'less than'
                            },
                            {
                                attribute: 'first name',
                                stringValue: 'Maryan',
                                stringComparison: 'is'
                            },
                            {
                                attribute: 'last location',
                                geofenceValue: {
                                    latitude: 43.651018,
                                    longitude: -79.375593,
                                    radius: 100,
                                    name: 'Toronto'
                                },
                                geofenceComparison: 'is within'
                            }
                        ],
                        condition: 'any'
                    }
            }]
        }


        if (segmentId in mockPredicateData) {
            return mockPredicateData[segmentId]
        }
    }
}

export default DynamicSegmentQuery
