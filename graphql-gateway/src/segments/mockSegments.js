let mockPredicateData = {
    '123abc': [
        {
            segmentId: '123abc',
            pageNumber: 0,
            pageSize: 150,
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
                        versionValue: [4, 0, 0],
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
                            end: new Date().toISOString()
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
                            name: 'geo1'
                        },
                        geofenceComparison: 'is within'
                    }
                ],
                condition: 'any'
            }
        }
    ],
    '456def': [
        {
            segmentId: '456def',
            pageNumber: 0,
            pageSize: 150,
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
                        versionValue: [2, 0, 0],
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
                            end: new Date().toISOString()
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
                            name: 'geo2'
                        },
                        geofenceComparison: 'is within'
                    }
                ],
                condition: 'any'
            }
        }
    ],
    '789hij': [
        {
            segmentId: '789hij',
            pageNumber: 0,
            pageSize: 150,
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
                        versionValue: [1, 0, 0],
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
                            end: new Date().toISOString()
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
                            name: 'geo3'
                        },
                        geofenceComparison: 'is within'
                    }
                ],
                condition: 'any'
            }
        }
    ],
    '101112klm': [
        {
            segmentId: '101112klm',
            pageNumber: 0,
            pageSize: 150,
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
                            name: 'geo4'
                        },
                        geofenceComparison: 'is within'
                    }
                ],
                condition: 'any'
            }
        }
    ]
}

let mockPredicateNullSegment = [
    {
        segmentId: '123abc',
        name: 'Toronto Users',
        pageNumber: 0,
        pageSize: 200
    },
    {
        segmentId: '456def',
        name: 'iOS Users',
        pageNumber: 0,
        pageSize: 200
    },
    {
        segmentId: '789hij',
        name: 'recent installations',
        pageNumber: 0,
        pageSize: 200
    },
    {
        segmentId: '101112klm',
        name: 'Stadium visitors',
        pageNumber: 0,
        pageSize: 200
    }
]

function getPredicates(predicates) {
    let device = []
    let profile = []
    JSON.parse(predicates).forEach(predicate => {
        if (predicate.category === 'device') {
            delete predicate.__typename
            delete predicate.category
            device.push(predicate)
        } else if (predicate.category === 'profile') {
            delete predicate.__typename
            delete predicate.category
            profile.push(predicate)
        }
    })
    return [device, profile]
}

export function archiveSegment(id) {
    for (let i = 0; i < mockPredicateNullSegment.length; i++) {
        if (mockPredicateNullSegment[i].segmentId === id) {
            mockPredicateNullSegment.splice(i, 1)
        }
    }
    for (let i = 0; i < mockPredicateData.length; i++) {
        if (mockPredicateData[i].segmentId === id) {
            mockPredicateData.splice(i, 1)
        }
    }
}

export function updateSegment(
    id,
    name = null,
    predicates = null,
    queryCondition = null
) {
    if (name !== null) {
        mockPredicateData[id][0].name = name
        mockPredicateNullSegment.forEach(segment => {
            if (segment.segmentId === id) {
                segment.name = name
            }
        })
    } else if (predicates !== null || queryCondition !== null) {
        let pred = getPredicates(predicates)
        mockPredicateData[id][0].predicates.device = pred[0]
        mockPredicateData[id][0].predicates.profile = pred[1]
        mockPredicateData[id][0].predicates.condition = queryCondition
    }
    return mockPredicateData[id][0]
}

export function addSegment(name, segmentId, predicates, queryCondition) {
    let pred = getPredicates(predicates)

    mockPredicateData[segmentId] = [
        {
            segmentId: segmentId,
            pageNumber: 0,
            pageSize: 150,
            name: name,
            predicates: {
                device: pred[0],
                profile: pred[1],
                condition: queryCondition
            }
        }
    ]
    mockPredicateNullSegment.push({
        segmentId: segmentId,
        name: name,
        pageNumber: 0,
        pageSize: 200
    })
}

export function getSegment(segmentId, pageNumber, pageSize) {
    if (!segmentId) {
        return mockPredicateNullSegment
    }

    mockPredicateData[segmentId][0].pageNumber = pageNumber
    mockPredicateData[segmentId][0].pageSize = pageSize
    return mockPredicateData[segmentId]
}
