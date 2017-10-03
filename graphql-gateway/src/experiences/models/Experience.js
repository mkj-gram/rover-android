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

import requireScope from '../../requireScope'

const Experience = new GraphQLObjectType({
    name: 'Experience',
    fields: () => ({
        hasUnpublishedChanges: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: requireScope('admin', data => {
                return data['has-unpublished-changes']
            })
        },
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: data => data['id']
        },
        isArchived: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: requireScope('admin', data => {
                return data['is-archived']
            })
        },
        isPublished: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: requireScope('admin', data => {
                return data['is-published']
            })
        },
        homeScreenId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['home-screen-id']
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['name']
            })
        },
        recentAverageDuration: {
            type: GraphQLInt,
            resolve: requireScope('admin', data => {
                return data['recent-average-duraction']
            })
        },
        screens: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Screen))),
            resolve: data => data['screens']
        },
        simulatorUrl: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['simulator-url']
            })
        },
        versionId: {
            type: GraphQLString,
            resolve: requireScope('admin', data => {
                return data['version-id']
            })
        },
        viewToken: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: requireScope('admin', data => {
                return data['view-token']
            })
        }
    })
})

export default Experience
