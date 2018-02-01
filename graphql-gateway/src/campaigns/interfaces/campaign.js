import {
    GraphQLEnumType,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLString
} from 'graphql'

import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

import { campaignStatus, campaignType } from '../types/definitions'

const campaign = new GraphQLInterfaceType({
    name: 'Campaign',
    description: 'TBD',
    fields: () => ({
        campaignId: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Campaign Identifier'
        },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Name of the Campaign'
        },
        campaignType: {
            type: campaignType,
            description: 'Type of the Campaign'
        },
        campaignStatus: {
            type: campaignStatus,
            description: 'Status of the Campaign'
        },
        UIState: {
            type: GraphQLJSON,
            description: 'State object for Campaigns App UI'
        },
        createdAt: {
            type: GraphQLDateTime,
            description: 'Campaign create date'
        },
        updatedAt: {
            type: GraphQLDateTime,
            description: 'Campaign latest update date'
        }
    })
})

export default campaign
