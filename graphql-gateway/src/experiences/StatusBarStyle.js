import { GraphQLEnumType } from 'graphql'

class StatusBarStyle { }

StatusBarStyle.type = new GraphQLEnumType({
    name: 'StatusBarStyle',
    values: {
        DARK: { value: 'dark' },
        LIGHT: { value: 'light' }
    }
})

export default StatusBarStyle
