import { GraphQLEnumType } from 'graphql'

class LockStatus { }

LockStatus.type = new GraphQLEnumType({
    name: 'LockStatus',
    values: {
    	UNLOCKED: { value: 'unlocked' },
        PARTIAL: { value: 'partial' },
        LOCKED: { value: 'locked' }
    }
})

export default LockStatus
