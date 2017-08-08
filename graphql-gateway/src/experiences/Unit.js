import { GraphQLEnumType } from 'graphql'

class Unit { }

Unit.type = new GraphQLEnumType({
    name: 'Unit',
    values: {
        POINTS: { value: 'points' },
        PERCENTAGE: { value: 'percentage' }
    }
})

export default Unit
