import { GraphQLEnumType } from 'graphql'

class BackgroundScale { }

BackgroundScale.type = new GraphQLEnumType({
    name: 'BackgroundScale',
    values: {
        X1: { value: 1 },
        X2: { value: 2 },
        X3: { value: 3 }
    }
})

export default BackgroundScale
