import { GraphQLEnumType } from 'graphql'

const Position = new GraphQLEnumType({
    name: 'Position',
    values: {
        STACKED: { value: 'stacked' },
        FLOATING: { value: 'floating' }
    }
})

export default Position
