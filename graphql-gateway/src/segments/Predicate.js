import {
    GraphQLBoolean,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'

const Predicate = new GraphQLInterfaceType({
    name: 'Predicate',
    description: 'Search predicate for building Segments',
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.attribute
        }
    })
})

export const StringPredicate = new GraphQLObjectType({
    name: 'StringPredicate',
    interfaces: [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.attribute
        },
        stringValue: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.stringValue
        },
        stringComparison: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.stringComparison
        }
    }),
    isTypeOf: predicate => !!predicate.stringValue
})

export const BooleanPredicate = new GraphQLObjectType({
    name: 'BooleanPredicate',
    interfaces: [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.attribute
        },
        booleanValue: {
            type: new GraphQLNonNull(GraphQLBoolean),
            resolve: predicate => predicate.booleanValue
        },
        booleanComparison: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.booleanComparison
        }
    }),
    isTypeOf: predicate => Object.keys(predicate).includes('booleanComparison')
})

export const NumberPredicate = new GraphQLObjectType({
    name: 'NumberPredicate',
    interfaces: [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.attribute
        },
        numberValue: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt))),
            resolve: predicate => predicate.numberValue
        },
        numberComparison: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.numberComparison
        }
    }),
    isTypeOf: predicate => !!predicate.numberComparison
})

export const DatePredicate = new GraphQLObjectType({
    name: 'DatePredicate',
    interfaces: [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.attribute
        },
        dateValue: {
            type: new GraphQLNonNull(DateValue),
            resolve: predicate => predicate.dateValue
        },
        dateComparison: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.dateComparison
        }
    }),
    isTypeOf: predicate => !!predicate.dateValue
})

const DateValue = new GraphQLObjectType({
    name: 'DateValue',
    fields: () => ({
        start: {
            type: new GraphQLNonNull(GraphQLDateTime)
        },
        end: {
            type: new GraphQLNonNull(GraphQLDateTime)
        }
    })
})

export const VersionPredicate = new GraphQLObjectType({
    name: 'VersionPredicate',
    interfaces: [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.attribute
        },
        versionValue: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt))),
            resolve: predicate => predicate.versionValue
        },
        versionComparison: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.versionComparison
        }
    }),
    isTypeOf: predicate => !!predicate.versionComparison
})

export const GeofencePredicate = new GraphQLObjectType({
    name: 'GeofencePredicate',
    interfaces: [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.attribute
        },
        geofenceValue: {
            type: new GraphQLNonNull(GeofenceValue),
            resolve: predicate => predicate.geofenceValue
        },
        geofenceComparison: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.geofenceComparison
        }
    }),
    isTypeOf: predicate => !!predicate.geofenceComparison
})

const GeofenceValue = new GraphQLObjectType({
    name: 'GeofenceValue',
    description: 'Latitude/Longitude coordinates paired with a radius',
    fields: () => ({
        latitude: {
            type: new GraphQLNonNull(GraphQLFloat),
            resolve: value => value.latitude
        },
        longitude: {
            type: new GraphQLNonNull(GraphQLFloat),
            resolve: value => value.longitude
        },
        radius: {
            type: new GraphQLNonNull(GraphQLInt),
            resolve: value => value.radius
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: value => value.name
        }
    })
})

export default Predicate
