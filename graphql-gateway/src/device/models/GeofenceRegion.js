import {
    GraphQLFloat,
    GraphQLObjectType,
    GraphQLNonNull
} from 'graphql'

const GeofenceRegion = new GraphQLObjectType({
    name: 'GeofenceRegion',
    fields: {
        latitude: {
            type: new GraphQLNonNull(GraphQLFloat),
            resolve: data => data['latitude']
        },
        longitude: {
            type: new GraphQLNonNull(GraphQLFloat),
            resolve: data => data['longitude']
        },
        radius: {
            type: new GraphQLNonNull(GraphQLFloat),
            resolve: data => data['radius']
        }
    }
})

export default GeofenceRegion
