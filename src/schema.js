import { 
    GraphQLID, 
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLString,
} from 'graphql'

import { getViewer } from './database'

import { CampaignRootType, campaignMutations, nodeField } from './types/CampaignTypes'

import GraphQLJSON from 'graphql-type-json'
import uuid from 'node-uuid'

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
        campaign: {
            type: CampaignRootType,
            resolve: () => getViewer()
        },
        node: nodeField
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
        },
        ...campaignMutations
    }
        
})

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
})

export default schema
