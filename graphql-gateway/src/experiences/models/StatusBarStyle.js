import { GraphQLEnumType } from 'graphql'

const StatusBarStyle = new GraphQLEnumType({
    name: 'StatusBarStyle',
    values: {
        DARK: { value: 'dark' },
        LIGHT: { value: 'light' }
    }
})

export default StatusBarStyle
