import {
    GraphQLFloat,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLUnionType
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

const Region = new GraphQLUnionType({
    name: 'Region',
    types: () => [BeaconRegion, GeofenceRegion],
    resolveType: data => {
        if (data['latitude']) {
            return GeofenceRegion
        }

        return BeaconRegion
    }
})

export default Region
