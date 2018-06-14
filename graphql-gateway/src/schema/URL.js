import { URL } from 'url'

import { GraphQLScalarType } from 'graphql';
import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';

const isURL = string => {
    try {
        // Throws an error if `string` is not a valid URL
        new URL(string)
    } catch(err) {
       return false
    }
    return true
}

const validate = string => {
    if (!isURL(string)) {
        throw new Error(`"${string}" is not a valid url`)
    }
}

export default new GraphQLScalarType({
    name: 'URL',
    description: 'A valid http(s) URL or deep-link',
    serialize: string => {
        validate(string)
        return string
    },
    parseValue: string => {
        validate(string)
        return string
    },
    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new GraphQLError(`Query error: Can only parse strings to urls but got a: ${ast.kind}`, [ast])
        }

        if (!isURL(ast.value)) {
            throw new GraphQLError('Query error: Invalid url', [ast])
        }
        
        return ast.value
    }
})
