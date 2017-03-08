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

const experienceType = new GraphQLObjectType({
	name: 'Experience',
	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		name: {
			type: new GraphQLNonNull(GraphQLString)
		}
	}
})

const eventType = new GraphQLInputObjectType({
    name: 'Event',
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

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        experience: {
            type: experienceType,
            args: {
            	id: {
            		type: new GraphQLNonNull(GraphQLID)
            	}
            },
            resolve(_, { id }) {
                return {
                	id: id,
                	name: 'My Experience'
                }
            }
        }
    }
})

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        trackEvents: {
            type: GraphQLString,
            args: {
                events: {
                    type: new GraphQLList(eventType)
                }
            },
            resolve(_, { events }) {
                const logs = events.forEach(event => {
                	return JSON.stringify({
                        id: uuid.v4(),
                        name: event.name,
                        timestamp: event.timestamp,
                        attributes: event.attributes
                    })
                })
                console.log(logs)
                return 'success'
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
})

export default schema
