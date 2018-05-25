import {
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLUnionType
} from 'graphql'

const Condition = new GraphQLEnumType({
    description: 'Query ANY or ALL condition',
    name: 'Condition',
    values: {
        ANY: { value: 'ANY' },
        ALL: { value: 'ALL' }
    }
})

export const BooleanPredicate = new GraphQLObjectType({
    name: 'BooleanPredicate',
    interfaces: () => [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString)
        },
        selector: {
            type: new GraphQLNonNull(GraphQLString)
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

export const DatePredicate = new GraphQLObjectType({
    name: 'DatePredicate',
    interfaces: () => [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString)
        },
        selector: {
            type: new GraphQLNonNull(GraphQLString)
        },
        dateValue: {
            type: new GraphQLNonNull(DatePredicateType),
            resolve: predicate => predicate.dateValue
        },
        dateComparison: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.dateComparison
        }
    }),
    isTypeOf: predicate => !!predicate.dateValue
})

const DatePredicateType = new GraphQLUnionType({
    name: 'DatePredicateType',
    types: () => [DatePredicateValue, DurationPredicateValue],
    resolveType: value =>
        value.start && value.start.hasOwnProperty('year')
            ? DatePredicateValue
            : DurationPredicateValue
})

const DatePredicateValue = new GraphQLObjectType({
    name: 'DatePredicateValue',
    fields: () => ({
        start: {
            type: DateValue
        }
    })
})

const DateValue = new GraphQLObjectType({
    name: 'DateValue',
    fields: () => ({
        day: {
            type: GraphQLInt
        },
        month: {
            type: GraphQLInt
        },
        year: {
            type: GraphQLInt
        }
    })
})

const DurationPredicateValue = new GraphQLObjectType({
    name: 'DurationPredicateValue',
    fields: () => ({
        duration: {
            type: GraphQLInt,
            resolve: predicate => predicate.duration
        }
    })
})

export const FloatPredicate = new GraphQLObjectType({
    name: 'FloatPredicate',
    interfaces: () => [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString)
        },
        selector: {
            type: new GraphQLNonNull(GraphQLString)
        },
        floatValue: {
            type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(GraphQLFloat))
            ),
            resolve: predicate => predicate.floatValue
        },
        floatComparison: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.floatComparison
        }
    }),
    isTypeOf: predicate => !!predicate.floatValue
})

export const GeofencePredicate = new GraphQLObjectType({
    name: 'GeofencePredicate',
    interfaces: () => [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString)
        },
        selector: {
            type: new GraphQLNonNull(GraphQLString)
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

export const NumberPredicate = new GraphQLObjectType({
    name: 'NumberPredicate',
    interfaces: () => [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString)
        },
        selector: {
            type: new GraphQLNonNull(GraphQLString)
        },
        numberValue: {
            type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(GraphQLInt))
            ),
            resolve: predicate => predicate.numberValue
        },
        numberComparison: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.numberComparison
        }
    }),
    isTypeOf: predicate => !!predicate.numberComparison
})

const Predicate = new GraphQLInterfaceType({
    name: 'Predicate',
    description: 'Search predicate for building Segments',
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString)
        },
        selector: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
})

export const PredicateAggregate = new GraphQLObjectType({
    name: 'PredicateAggregate',
    description:
        'Object containing list of device predicates and list of profile predicates',
    fields: () => ({
        predicateList: {
            type: new GraphQLNonNull(new GraphQLList(Predicate))
        },
        condition: {
            type: new GraphQLNonNull(Condition)
        }
    })
})

export const StringArrayPredicate = new GraphQLObjectType({
    name: 'StringArrayPredicate',
    description: 'Array of tags predicate',
    interfaces: () => [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString)
        },
        selector: {
            type: new GraphQLNonNull(GraphQLString)
        },
        stringArrayComparison: {
            type: new GraphQLNonNull(GraphQLString)
        },
        stringArrayValue: {
            type: new GraphQLNonNull(new GraphQLList(GraphQLString))
        }
    }),
    isTypeOf: predicate => !!predicate.stringArrayComparison
})

export const StringPredicate = new GraphQLObjectType({
    name: 'StringPredicate',
    interfaces: () => [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString)
        },
        selector: {
            type: new GraphQLNonNull(GraphQLString)
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

export const VersionPredicate = new GraphQLObjectType({
    name: 'VersionPredicate',
    interfaces: () => [Predicate],
    fields: () => ({
        attribute: {
            type: new GraphQLNonNull(GraphQLString)
        },
        selector: {
            type: new GraphQLNonNull(GraphQLString)
        },
        versionValue: {
            type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(GraphQLInt))
            ),
            resolve: predicate => predicate.versionValue
        },
        versionComparison: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: predicate => predicate.versionComparison
        }
    }),
    isTypeOf: predicate => !!predicate.versionComparison
})
