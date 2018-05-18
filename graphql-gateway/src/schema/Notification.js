import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLObjectType,
    GraphQLUnionType
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'
import { OpenURLAction, PresentExperienceAction, PresentWebsiteAction } from './Action'

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
        action: {
            type: NotificationAction
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

const NotificationAction = new GraphQLUnionType({
    name: 'NotificationAction',
    types: () => [OpenURLAction, PresentExperienceAction, PresentWebsiteAction],
    resolveType: data => {
        switch (data['__typename']) {
            case 'OpenURLAction':
                return OpenURLAction
            case 'PresentExperienceAction':
                return PresentExperienceAction
            case 'PresentWebsiteAction':
                return PresentWebsiteAction
        }
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
