import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLObjectType
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'

import GraphQLJSON from 'graphql-type-json'

import NotificationAction from './NotificationAction'

const Notification = new GraphQLObjectType({
    name: 'Notification',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        campaignId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        title: {
            type: GraphQLString
        },
        body: {
            type: new GraphQLNonNull(GraphQLString)
        },
        action: {
            type: new GraphQLNonNull(NotificationAction)
        },
        deliveredAt: {
            type: new GraphQLNonNull(GraphQLDateTime)
        },
        expiresAt: {
            type: GraphQLDateTime
        },
        isRead: {
            type: new  GraphQLNonNull(GraphQLBoolean)
        },
        isNotificationCenterEnabled: {
            type: new  GraphQLNonNull(GraphQLBoolean)
        }
    }
})

export default Notification
