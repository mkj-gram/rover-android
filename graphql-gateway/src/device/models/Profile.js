import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

const Profile = new GraphQLObjectType({
    name: 'Profile',
    fields: {
        identifier: {
            type: new GraphQLNonNull(GraphQLID)
        },
        attributes: {
            type: new GraphQLNonNull(GraphQLJSON)
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLDateTime)
        },
        updatedAt: {
            type: new GraphQLNonNull(GraphQLDateTime)
        }
    }
})

export default Profile
