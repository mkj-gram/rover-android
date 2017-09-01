function createRecords(records, segmentSize, page) {
    let devices = []
    let profiles = []

    let profileIds = ['123abc', '456def', '789ghi']
    let deviceOSs = ['iOS', 'Android', 'Blackberry']
    let deviceOSVersion = [
        {
            major: 10,
            minor: 0,
            revision: 0
        },
        {
            major: 2,
            minor: 1,
            revision: 5
        },
        {
            major: 15,
            minor: 11,
            revision: 2
        }
    ]
    let appVersion = ['1', '2', '3', '4', '5', '6']
    let firstNames = [
        'Alex',
        'Maryan',
        'Chris',
        'Will',
        'Sean',
        'Mike',
        'John',
        'Steve'
    ]
    let lastNames = ['Graham', 'Smith', '1337']

    for (let i = 0; i < records; i++) {
        devices.push({
            profileId:
                profileIds[Math.floor(Math.random() * profileIds.length)],
            deviceOS: deviceOSs[Math.floor(Math.random() * profileIds.length)],
            deviceOSVersion:
                deviceOSVersion[Math.floor(Math.random() * profileIds.length)],
            deviceId: profileIds[Math.floor(Math.random() * profileIds.length)],
            SDKVersion: {
                major: 2,
                minor: 0,
                revision: 0
            },
            hardware: `iPhone ${i}`,
            model: `${i}: ${page}`,
            appVersion:
                appVersion[Math.floor(Math.random() * profileIds.length)],
            pushEnabled: true,
            bluetoothOn: true,
            locationPermissions: true,
            carrier: 'Bell',
            timezone: 'Eastern',
            location: {
                latitude: '43.6532',
                longitude: '79.3832',
                city: 'Toronto',
                region: 'Ontario',
                country: 'Canada',
                name: 'Rover HQ'
            },
            language: 'EN',
            lastSeen: new Date().toISOString(),
            createdAt: new Date().toISOString()
        })

        profiles.push({
            profileId:
                profileIds[Math.floor(Math.random() * profileIds.length)],
            firstName:
                firstNames[Math.floor(Math.random() * profileIds.length)],
            lastName: lastNames[Math.floor(Math.random() * profileIds.length)],
            email: 'alex@rover.io',
            phoneNumber: '7053775576',
            age: 27,
            gender: 'male',
            deviceCount: 4,
            propensities: ['fishing', 'food']
        })
    }
    const dataGridRows = devices.map((device) => {
        const { profileId } = device
        if (profileId) {
            return {
                ...device,
                ...profiles.filter(
                    profile => profile.profileId === profileId
                )[0]
            }
        }
        return {}
    })
    return {
        segmentSize: segmentSize,
        totalSize: 1000,
        dataGridRows
    }
}

export const getSegmentPageById = (segmentId, pageNumber, pageSize) => {
    let ret
    if (segmentId === '123abc') {
        if (pageNumber === 0) {
            ret = createRecords(pageSize, 330, 0)
        } else if (pageNumber === 1) {
            ret = createRecords(pageSize, 330, 1)
        } else if (pageNumber === 2) {
            ret = createRecords(30, 330, 2)
        }
    } else if (segmentId === '456def') {
        if (pageNumber === 0) {
            ret = createRecords(pageSize, 700, 0)
        } else if (pageNumber === 1) {
            ret = createRecords(pageSize, 700, 1)
        } else if (pageNumber === 2) {
            ret = createRecords(pageSize, 700, 2)
        } else if (pageNumber === 3) {
            ret = createRecords(pageSize, 700, 3)
        } else if (pageNumber === 4) {
            ret = createRecords(100, 700, 4)
        }
    } else if (segmentId === '789hij') {
        if (pageNumber === 0) {
            ret = createRecords(30, 30, 0)
        }
    } else if (segmentId === '101112klm') {
        if (pageNumber === 0) {
            ret = createRecords(pageSize, 1000, 0)
        } else if (pageNumber === 1) {
            ret = createRecords(pageSize, 1000, 1)
        } else if (pageNumber === 2) {
            ret = createRecords(pageSize, 1000, 2)
        } else if (pageNumber === 3) {
            ret = createRecords(pageSize, 1000, 3)
        } else if (pageNumber === 4) {
            ret = createRecords(pageSize, 1000, 4)
        } else if (pageNumber === 5) {
            ret = createRecords(pageSize, 1000, 5)
        } else if (pageNumber === 6) {
            ret = createRecords(100, 1000, 6)
        }
    } else {
        if (pageNumber === 0) {
            ret = createRecords(pageSize, 350, 0)
        } else if (pageNumber === 1) {
            ret = createRecords(pageSize, 350, 1)
        } else if (pageNumber === 2) {
            ret = createRecords(50, 350, 2)
        }
    }
    return ret
}

export const getSegmentPageByPredicates = (
    predicates,
    pageNumber,
    pageSize
) => {
    let ret

    if (
        predicates.length == 0 ||
        (predicates['profiles'] &&
            predicates['profiles'].length == 0 &&
            predicates['devices'] &&
            predicates['devices'].length == 0)
    ) {
        if (pageNumber === 0) {
            ret = createRecords(pageSize, 455, 0)
        } else if (pageNumber === 1) {
            ret = createRecords(pageSize, 455, 1)
        } else if (pageNumber === 2) {
            ret = createRecords(pageSize, 455, 2)
        } else if (pageNumber === 3) {
            ret = createRecords(5, 455, 3)
        }
    } else if (
        predicates['devices'] &&
        predicates['devices'].length > 0 &&
        predicates['devices'][0]['stringValue'] == 'Android'
    ) {
        ret = createRecords(40, 40, 0)
    } else {
        if (pageNumber === 0) {
            ret = createRecords(pageSize, 320, 0)
        } else if (pageNumber === 1) {
            ret = createRecords(pageSize, 320, 1)
        } else {
            ret = createRecords(20, 320, 2)
        }
    }
    return ret
}
