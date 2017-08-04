import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import Predicate from './Predicate'

const PredicateAggregate = new GraphQLObjectType({
    name: 'PredicateAggregate',
    description: 'Object containing list of device predicates and list of profile predicates',
    fields: () => ({
        device: {
            type: new GraphQLNonNull(new GraphQLList(Predicate)),
            resolve: ({ device }) => device
        },
        profile: {
            type: new GraphQLNonNull(new GraphQLList(Predicate)),
            resolve: ({ profile }) => profile
        },
        condition: {
            type: new GraphQLNonNull(new GraphQLEnumType({
                                description: 'Query ANY or ALL condition',
                                name: 'condition',
                                values: {
                                    ANY: {
                                        value: 'any'
                                    },
                                    ALL: {
                                        value: 'all'
                                    }
                                }
                            })),
            resolve: ({ condition }) => condition
        }
    })
})

export default PredicateAggregate
