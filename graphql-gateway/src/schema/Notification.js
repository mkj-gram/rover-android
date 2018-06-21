import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLObjectType,
    GraphQLUnionType
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'
import URL from './URL'

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
        tapBehavior: {
            type: new GraphQLNonNull(NotificationTapBehavior)
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

const NotificationTapBehavior = new GraphQLUnionType({
    name: 'NotificationTapBehavior',
    types: () => [OpenAppNotificationTapBehavior, OpenURLNotificationTapBehavior, PresentWebsiteNotificationTapBehavior],
    resolveType: data => {
        switch (data['__typename']) {
            case 'OpenAppNotificationTapBehavior':
                return OpenAppNotificationTapBehavior
            case 'OpenURLNotificationTapBehavior':
                return OpenURLNotificationTapBehavior
            case 'PresentWebsiteNotificationTapBehavior':
                return PresentWebsiteNotificationTapBehavior
        }
    }
})

export const OpenAppNotificationTapBehavior = new GraphQLObjectType({
    name: 'OpenAppNotificationTapBehavior',
    description: 'A tap behavior indicating the app should be opened when the notification is tapped, but no further action is required',
    fields: () => ({
        placeholder: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'This property should not be used. It is simply a placeholder because GraphQL does not permit types without any fields.',
            resolve: () => 'placeholder'
        }
    })
})

export const OpenURLNotificationTapBehavior = new GraphQLObjectType({
    name: 'OpenURLNotificationTapBehavior',
    description: 'A tap behavior indicating a URL (website or deep link) should be opened when the notification is tapped',
    fields: () => ({
        url: {
            type: new GraphQLNonNull(URL)
        },
        dismiss: {
            type: new GraphQLNonNull(GraphQLBoolean)
        }
    })
})

export const PresentWebsiteNotificationTapBehavior = new GraphQLObjectType({
    name: 'PresentWebsiteNotificationTapBehavior',
    description: 'A tap behavior indicating a website should be presented within the app when the notification is tapped',
    fields: () => ({
        url: {
            type: new GraphQLNonNull(URL)
        }
    })
})

export default Notification
