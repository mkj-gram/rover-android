import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

const Context = new GraphQLInputObjectType({
    name: 'Context',
    fields: () => ({
        appBadgeNumber: {
            type: GraphQLInt
        },
        appBuild: {
            type: GraphQLString
        },
        appName: {
            type: GraphQLString
        },
        appNamespace: {
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
        deviceManufacturer: {
            type: GraphQLString
        },
        deviceModel: {
            type: GraphQLString
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
        sdkVersion: {
            type: GraphQLString
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
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        timestamp: {
            type: new GraphQLNonNull(GraphQLString)
        },
        context: {
            type: new GraphQLNonNull(Context)
        },
        attributes: {
            type: GraphQLJSON
        }
    })
})

export default Event