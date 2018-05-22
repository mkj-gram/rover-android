import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLUnionType
} from 'graphql'

import Notification from './Notification'

const Action = new GraphQLUnionType({
    name: 'Action',
    types: () => [AddNotificationAction, GoToScreenAction, OpenURLAction, PresentExperienceAction, PresentWebsiteAction],
    resolveType: data => {
        switch (data['__typename']) {
            case 'AddNotificationAction':
                return AddNotificationAction
            case 'GoToScreenAction':
                return GoToScreenAction
            case 'OpenURLAction':
                return OpenURLAction
            case 'PresentExperienceAction':
                return PresentExperienceAction
            case 'PresentWebsiteAction':
                return PresentWebsiteAction
        }
    }
})

export const AddNotificationAction = new GraphQLObjectType({
    name: 'AddNotificationAction',
    fields: () => ({
        notification: {
            type: new GraphQLNonNull(Notification)
        }
    })
})

export const GoToScreenAction = new GraphQLObjectType({
    name: 'GoToScreenAction',
    fields: () => ({
        screenID: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

export const OpenURLAction = new GraphQLObjectType({
    name: 'OpenURLAction',
    fields: () => ({
        url: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

export const PresentExperienceAction = new GraphQLObjectType({
    name: 'PresentExperienceAction',
    fields: () => ({
        campaignID: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

export const PresentNotificationCenterAction = new GraphQLObjectType({
    name: 'PresentNotificationCenterAction',
    fields: () => ({ 
        placeholder: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'This property should not be used. It is simply a placeholder because GraphQL does not permit types without any fields.',
            resolve: () => 'placeholder'
        }
    })
})

export const PresentWebsiteAction = new GraphQLObjectType({
    name: 'PresentWebsiteAction',
    fields: () => ({
        url: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

export default Action
