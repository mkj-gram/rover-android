import {
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import Screen from './Screen'

const Experience = new GraphQLObjectType({
    name: 'Experience',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: data => data['id']
        },
        homeScreenId: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['home-screen-id']
        },
        screens: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Screen))),
            resolve: data => data['screens']
        }
    })
})

export default Experience
