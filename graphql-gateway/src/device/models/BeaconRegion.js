import {
    GraphQLInt,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

const BeaconRegion = new GraphQLObjectType({
    name: 'BeaconRegion',
    fields: {
        uuid: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: data => data['uuid']
        },
        major: {
            type: GraphQLInt,
            resolve: data => data['major-number']
        },
        minor: {
            type: GraphQLInt,
            resolve: data => data['minor-number']
        }
    }
})

export default BeaconRegion
