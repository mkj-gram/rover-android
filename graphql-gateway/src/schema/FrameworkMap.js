import { GraphQLScalarType } from 'graphql'
import GraphQLVersion from './Version'

/**
 * Takes a map and converts its value based on the supplied function
 * @param  {Any} value
 * @return {Object}       object representing a FrameworkMap
 */
const map = (value, func) => {
	const obj = {}
	if (typeof func !== 'function') {
		func = (v) => v	
	}

	Object.keys(value).forEach(key => {
		if (typeof key !== 'string') {
			throw new TypeError(`map key must be of type String instead got (${typeof key}): ${key}`)
		}

		const v = value[key]
		if (typeof v !== 'string') {
			throw new TypeError(`map value must be of type String instead got (${typeof v}): ${JSON.stringify(v)}`)
		}

		obj[key] = func(v)
	})

	return obj
}

/**
 * Serialize javascript value for graphql output
 * @param  {Any} value
 * @return {Object}
 */
const serialize = (value) => {
	if (typeof value !== 'object') {
		throw new TypeError('value must be an object')
	}
	
	return map(value, (v) => GraphQLVersion.serialize(v))
}

/**
 * Parse incoming graphql object to a javascript object
 * @param  {Any} value
 * @return {Object}
 */
const parseValue = (value) => {
	if (typeof value !== 'object') {
		throw new TypeError('value must be a map')
	}

	return map(value, (v) => GraphQLVersion.parseValue(v))
}

const parseLiteral = (value) => {
	throw new Error('literals unsupported')
}

const GraphQLFrameworkMap = new GraphQLScalarType({
	name: 'FrameworkMap',
	description: 'A map of framework identifiers to versions',
	serialize: serialize,
	parseValue: parseValue,
	parseLiteral: parseLiteral
})

export default GraphQLFrameworkMap