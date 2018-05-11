import { GraphQLScalarType } from 'graphql'

const VersionRegex = /^((\d+\.\d+)|(\d+\.\d+\.\d+)+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/

/**
 * Validate the string value against the VersionRegex. If no match is found a TypeError is thrown
 * @param  {String} string
 * @return {Array}
 */
const validateStringValue = (string) => {
	const match = string.match(VersionRegex)
	if (match === null) {
		throw new TypeError("invalid version must match: " + VersionRegex)
	}

	return match
}

/**
 * Parse the incoming string as a version
 * @param  {String} string the string to parse
 * @return {Version}        [description]
 */
const parseStringValue = (string) => {
	const match = validateStringValue(string)

	const version = match[1].split('.').map(i => parseInt(i))
	const preRelease = match[4] || ''
	const meta = match[5] || ''
	
	return {
		'major': 		version[0],
		'minor': 		version[1],
		'patch': 		version[2] || 0,
		'preRelease': 	preRelease,
		'meta': 		meta
	}
}

/**
 * Parse the incoming object as a version
 * @param  {Object} obj
 * @return {Version}
 */
const parseObjectValue = (obj) => {
	let {
		major,
		minor,
		patch,
		meta,
		preRelease
	} = obj

	// Meta and PreRelease are optional default to empty string
	meta = meta || ''
	preRelease = preRelease || ''

	if (typeof major !== 'number') {
		throw new TypeError('major must be a number but got: ' + typeof major)
	}

	if (typeof minor !== 'number') {
		throw new TypeError('minor must be a number but got: ' + typeof minor)
	}

	if (typeof patch !== 'number') {
		throw new TypeError('patch must be a number but got: ' + typeof patch)
	}

	if (typeof preRelease !== 'string') {
		throw new TypeError('preRelease must be a string but got: ' + typeof preRelease)
	}

	if (typeof meta !== 'string') {
		throw new TypeError('meta must be a string but got: ' + typeof meta)
	}

	return {
		'major': 		major,
		'minor': 		minor,
		'patch': 		patch,
		'preRelease':  	preRelease,
		'meta': 		meta
	}
}


/**
 * Serialize the string value for output
 * @param  {String} string
 * @return {String}        
 */
const serializeString = (string) => {
	validateStringValue(string)
	return string
}

/**
 * Serialize Object value for ouput
 * @param  {Object} obj
 * @return {String}
 */
const serializeObject = (obj) => {
	const value = parseObjectValue(obj)

	let ret = `${value.major}.${value.minor}.${value.patch}`

	if (value.preRelease) {
		ret =  ret.concat(`-${value.preRelease}`)
	}

	if (value.meta) {
		ret = ret.concat(`+${value.meta}`)
	}

	return ret
}

/**
 * Serialize javascript value for graphql output
 * @param  {Any} value
 * @return {String}
 */
const serialize = (value) => {
	switch(typeof value) {
		case 'string':
			return serializeString(value)
		case 'object':
			return serializeObject(value)
		default:
			throw new TypeError('version must be of type string or object but recieved: ' + (typeof value))
	}
}

/**
 * Parse incoming graphql object to a javascript object
 * @param  {Any} value
 * @return {Object}
 */
const parseValue = (value) => {
	switch(typeof value) {
		case 'string':
			return parseStringValue(value)
		case 'object':
			return parseObjectValue(value)
		default:
			throw new TypeError('version must be of type string or object but recieved: ' + (typeof value))
	}
}

const parseLiteral = (value) => {
	throw new Error('literals unsupported')
}

const GraphQLVersion = new GraphQLScalarType({
	name: 'Version',
	description: 'A semantic version represented as string or object (https://semver.org/)',
	serialize: serialize,
	parseValue: parseValue,
	parseLiteral: parseLiteral
})

export default GraphQLVersion