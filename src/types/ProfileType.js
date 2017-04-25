import { 
    GraphQLEnumType,
    GraphQLInt,
    GraphQLList, 
    GraphQLObjectType, 
    GraphQLString,
} from 'graphql'

import GraphQLJSON from 'graphql-type-json'

const GenderType = new GraphQLEnumType({
    name: 'Gender',
    values: {
        MALE: { 
            value: 'male' 
        },
        FEMALE: { 
            value: 'female'
        }
    }
})

const ProfileType = new GraphQLObjectType({
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
            type: GenderType
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

export default ProfileType
