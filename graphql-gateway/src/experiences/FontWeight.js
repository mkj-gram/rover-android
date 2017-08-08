import { GraphQLEnumType } from 'graphql'

class FontWeight { }

FontWeight.type = new GraphQLEnumType({
    name: 'FontWeight',
    values: {
        ULTRA_LIGHT: { value: 100 },
        THIN: { value: 200 },
        LIGHT: { value: 300 },
        REGULAR: { value: 400 },
        MEDIUM: { value: 500 },
        SEMI_BOLD: { value: 600 },
        BOLD: { value: 700 },
        HEAVY: { value: 800 },
        BLACK: { value: 900 }
    }
})

export default FontWeight
