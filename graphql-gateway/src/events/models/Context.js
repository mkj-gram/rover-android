import {
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLString,
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

const Context = new GraphQLInputObjectType({
    name: 'Context',
    fields: () => ({
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

export default Context