import {
    GraphQLBoolean,
    GraphQLID, 
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLInterfaceType,
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLString,
    GraphQLUnionType
} from 'graphql'

import uuid from 'node-uuid'
import { CampaignType } from './CampaignType'

export const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User Information',
    fields: () => ({
        id: GraphQLInt,
        name: GraphQLString,
        email: GraphQLString,
        account_id: GraphQLInt
    })
})

export const AccountType = new GraphQLObjectType({
    name: 'Account',
    description: 'Account Information',
    fields: () => ({
        id: GraphQLID,
        title: GraphQLString,
        campaigns: new GraphQLList(CampaignType)
    })
})
