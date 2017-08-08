import { GraphQLObjectType } from 'graphql'

import Profile from './Profile'

class SyncResult { }

SyncResult.type = new GraphQLObjectType({
    name: 'SyncResult',
    fields: {
        profile: { type: Profile.type }
    }
})

export default SyncResult
