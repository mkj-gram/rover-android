import { 
    GraphQLID, 
    GraphQLInputObjectType, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLString 
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'
import uuid from 'node-uuid'

const eventInputType = new GraphQLInputObjectType({
    name: 'EventInput',
    fields: {
        name: {
            type: GraphQLString
        },
        timestamp: {
            type: GraphQLString
        },
        attributes: {
            type: GraphQLJSON
        }
    }
})

const eventType = new GraphQLObjectType({
    name: 'Event',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        timestamp: {
            type: new GraphQLNonNull(GraphQLString)
        },
        attributes: {
            type: new GraphQLNonNull(GraphQLJSON)
        }
    }
})

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        hello: {
            type: GraphQLString,
            resolve() {
                return 'Hello, world!'
            }
        }
    }
})

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        trackEvents: {
            type: new GraphQLList(eventType),
            args: {
                events: {
                    type: new GraphQLList(eventInputType)
                }
            },
            resolve(_, { events }) {
                return events.map(eventInput => {
                    return {
                        id: uuid.v4(),
                        name: eventInput.name,
                        timestamp: eventInput.timestamp,
                        attributes: eventInput.attributes
                    }
                })
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
})

export default schema
