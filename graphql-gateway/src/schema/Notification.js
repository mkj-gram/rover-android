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

const OpenURLNotificationAction = new GraphQLObjectType({
    name: 'OpenURLNotificationAction',
    fields: {
        url: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['url']
        }
    }
})

const PresentExperienceNotificationAction = new GraphQLObjectType({
    name: 'PresentExperienceNotificationAction',
    fields: {
        experienceId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['experienceId']
        }
    }
})

const PresentWebsiteNotificationAction = new GraphQLObjectType({
    name: 'PresentWebsiteNotificationAction',
    fields: {
        url: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['url']
        }
    }
})

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

const NotificationAction = new GraphQLUnionType({
    name: 'NotificationAction',
    types: () => [OpenURLNotificationAction, PresentExperienceNotificationAction, PresentWebsiteNotificationAction],
    resolveType: data => {
        switch (data['__className']) {
            case 'OpenURLNotificationAction':
                return OpenURLNotificationAction
                break
            case 'PresentExperienceNotificationAction':
                return PresentExperienceNotificationAction
                break
            case 'PresentWebsiteNotificationAction':
                return PresentWebsiteNotificationAction
                break
            default:
                return null
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

const NotificationAttachmentType = new GraphQLEnumType({
    name: 'NotificationAttachmentType',
    values: {
        AUDIO: { value: 'audio' },
        IMAGE: { value: 'image' },
        VIDEO: { value: 'video' }
    }
})

export default Notification
