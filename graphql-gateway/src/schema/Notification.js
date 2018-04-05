import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLObjectType,
    GraphQLUnionType,
    GraphQLInputObjectType
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'

import ActionInfo from './ActionInfo'

const Notification = new GraphQLObjectType({
    name: 'Notification',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        campaignID: {
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
        actionInfo: {
            type: new GraphQLNonNull(ActionInfo)
        },
        deliveredAt: {
            type: new GraphQLNonNull(GraphQLDateTime)
        },
        expiresAt: {
            type: GraphQLDateTime
        },
        isRead: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        isNotificationCenterEnabled: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        isDeleted: {
            type: new GraphQLNonNull(GraphQLBoolean)
        }
    })
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

export const NotificationAttachmentInput = new GraphQLInputObjectType({
    name: 'NotificationAttachmentInput',
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
