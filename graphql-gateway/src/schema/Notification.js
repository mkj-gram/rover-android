import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLObjectType,
    GraphQLUnionType
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'

import GraphQLJSON from 'graphql-type-json'

const Notification = new GraphQLObjectType({
    name: 'Notification',
    fields: () => ({
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
        attachment: {
            type: NotificationAttachment
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
        },
        isDeleted: {
            type: new GraphQLNonNull(GraphQLBoolean)
        }
    })
})

const NotificationAction = new GraphQLObjectType({
    name: 'NotificationAction',
    fields: () => ({
        experienceId: {
            type: GraphQLString
        },
        type: {
            type: new GraphQLNonNull(NotificationActionType)
        },
        url: {
            type: GraphQLString
        }
    })
})

const NotificationActionType = new GraphQLEnumType({
    name: 'NotificationActionType',
    values: {
        OPEN_APP: { value: 'openApp' },
        OPEN_URL: { value: 'openUrl' },
        PRESENT_EXPERIENCE: { value: 'presentExperience' },
        PRESENT_WEBSITE: { value: 'presentWebsite' }
    }
})

export const NotificationAttachment = new GraphQLObjectType({
    name: 'NotificationAttachment',
    fields: () => ({
        type: {
            type: new GraphQLNonNull(NotificationAttachmentType)
        },
        url: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

const NotificationAttachmentType = new GraphQLEnumType({
    name: 'NotificationAttachmentType',
    values: {
        AUDIO: { value: 'audio' },
        IMAGE: { value: 'image' },
        VIDEO: { value: 'video' }
    }
})

export default Notification
