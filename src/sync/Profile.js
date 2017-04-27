import { 
    GraphQLEnumType,
    GraphQLInt,
    GraphQLList, 
    GraphQLObjectType, 
    GraphQLString,
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

import Gender from './Gender'

class Profile { }

Profile.type = new GraphQLObjectType({
    name: 'Profile',
    fields: {
        profileID: {
            type: GraphQLString
        },
        firstName: {
            type: GraphQLString
        },
        lastName: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        gender: {
            type: Gender.type
        },
        age: {
            type: GraphQLInt
        },
        phoneNumber: {
            type: GraphQLString
        },
        tags: {
            type: new GraphQLList(GraphQLString)
        },
        traits: {
            type: GraphQLJSON
        }
    }
})

export default Profile
