import { GraphQLObjectType } from 'graphql'
import ProfileType from './ProfileType'

const SyncResultType = new GraphQLObjectType({
    name: 'SyncResult',
    fields: {
        profile: { type: ProfileType }
    }
})

export default SyncResultType
