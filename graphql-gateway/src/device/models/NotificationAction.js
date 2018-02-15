import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLUnionType
} from 'graphql'

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

export default NotificationAction
