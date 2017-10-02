import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import Screen from './Screen'

const Experience = new GraphQLObjectType({
    name: 'Experience',
    fields: () => ({
        hasUnpublishedChanges: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => {
                // TODO: Verify admin scope
                return data['has-unpublished-changes']
            }
        },
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: data => data['id']
        },
        isArchived: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => {
                // TODO: Verify admin scope
                return data['is-archived']
            }
        },
        isPublished: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: data => {
                // TODO: Verify admin scope
                return data['is-published']
            }
        },
        homeScreenId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['home-screen-id']
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => {
                // TODO: Verify admin scope
                return data['name']
            }
        },
        recentAverageDuration: {
            type: GraphQLInt,
            resolve: data => {
                // TODO: Verify admin scope
                return data['recent-average-duraction']
            }
        },
        screens: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Screen))),
            resolve: data => data['screens']
        },
        simulatorUrl: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => {
                // TODO: Verify admin scope
                return data['simulator-url']
            }
        },
        versionId: {
            type: GraphQLString,
            resolve: data => {
                // TODO: Verify admin scope
                return data['version-id']
            }
        },
        viewToken: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => {
                // TODO: Verify admin scope
                return data['view-token']
            }
        }
    })
})

export default Experience
