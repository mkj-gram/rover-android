import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import Predicate from './Predicate'

const PredicateAggregate = new GraphQLObjectType({
    name: 'PredicateAggregate',
    description: 'Object containing list of device predicates and list of profile predicates',
    fields: () => ({
        predicateList: {
            type: new GraphQLNonNull(new GraphQLList(Predicate))
        },
        condition: {
            type: new GraphQLNonNull(new GraphQLEnumType({
                                description: 'Query ANY or ALL condition',
                                name: 'condition',
                                values: {
                                    ANY: {
                                        value: 'ANY'
                                    },
                                    ALL: {
                                        value: 'ALL'
                                    }
                                }
                            }))
        }
    })
})

export default PredicateAggregate
