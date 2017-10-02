import { GraphQLEnumType } from 'graphql'

const Unit = new GraphQLEnumType({
    name: 'Unit',
    values: {
        POINTS: { value: 'points' },
        PERCENTAGE: { value: 'percentage' }
    }
})

export default Unit
