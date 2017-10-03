import { GraphQLEnumType } from 'graphql'

const LockStatus = new GraphQLEnumType({
    name: 'LockStatus',
    values: {
    	UNLOCKED: { value: 'unlocked' },
        PARTIAL: { value: 'partial' },
        LOCKED: { value: 'locked' }
    }
})

export default LockStatus
