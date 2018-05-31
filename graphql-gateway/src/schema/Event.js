import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

import GraphQLFrameworkMap from './FrameworkMap'

const DeviceContext = new GraphQLInputObjectType({
    name: 'DeviceContext',
    fields: () => ({
        appBadgeNumber: {
            type: GraphQLInt
        },
        appBuild: {
            type: GraphQLString
        },
        appIdentifier: {
            type: GraphQLString
        },
        appVersion: {
            type: GraphQLString
        },
        attributes: {
            type: GraphQLJSON
        },
        carrierName: {
            type: GraphQLString
        },
        deviceIdentifier: {
            type: new GraphQLNonNull(GraphQLID)
        },
        deviceManufacturer: {
            type: GraphQLString
        },
        deviceModel: {
            type: GraphQLString
        },
        deviceName: {
            type: GraphQLString
        },
        frameworks: {
            type: GraphQLFrameworkMap
        },
        isBluetoothEnabled: {
            type: GraphQLBoolean
        },
        isCellularEnabled: {
            type: GraphQLBoolean
        },
        isLocationServicesEnabled: {
            type: GraphQLBoolean
        },
        isWifiEnabled: {
            type: GraphQLBoolean
        },
        locationAuthorization: {
            type: GraphQLString
        },
        localeLanguage: {
            type: GraphQLString
        },
        localeRegion: {
            type: GraphQLString
        },
        localeScript: {
            type: GraphQLString
        },
        notificationAuthorization: {
            type: GraphQLString
        },
        operatingSystemName: {
            type: GraphQLString
        },
        operatingSystemVersion: {
            type: GraphQLString
        },
        profileIdentifier: {
            type: GraphQLString
        },
        pushEnvironment: {
            type: GraphQLString
        },
        pushToken: {
            type: GraphQLString
        },
        radio: {
            type: GraphQLString
        },
        screenWidth: {
            type: GraphQLInt
        },
        screenHeight: {
            type: GraphQLInt
        },
        timeZone: {
            type: GraphQLString
        },
    })
})

const Event = new GraphQLInputObjectType({
    name: 'Event',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        namespace: {
            type: GraphQLString,
            description: 'Grouping of related events'
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        timestamp: {
            type: new GraphQLNonNull(GraphQLString)
        },
        device: {
            type: DeviceContext
        },
        attributes: {
            type: GraphQLJSON
        }
    })
})

export default Event
