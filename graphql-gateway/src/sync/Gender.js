import { GraphQLEnumType } from 'graphql'

class Gender { }

Gender.type = new GraphQLEnumType({
    name: 'Gender',
    values: {
        MALE: { 
            value: 'male' 
        },
        FEMALE: { 
            value: 'female'
        }
    }
})

export default Gender
