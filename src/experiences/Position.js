import { GraphQLEnumType } from 'graphql'

class Position { }

Position.type = new GraphQLEnumType({
    name: 'Position',
    values: {
        STACKED: { value: 'stacked' },
        FLOATING: { value: 'floating' }
    }
})

export default Position
