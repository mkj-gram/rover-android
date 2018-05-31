/**
 * 	Extensions added to proto.rover.protobuf.Version
 */

const VersionRegex = /^((\d+)|(\d+\.\d+)|(\d+\.\d+\.\d+)+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/

/**
 * Converts this JavaScript value to a new Version proto.
 * @param {!proto.rover.protobuf.JavaScriptValue} value The value to
 *     convert.
 * @return {!proto.rover.protobuf.Version} The newly constructed value.
 */
proto.rover.protobuf.Version.fromJavaScript = function(value) {
	if (value === null || value === undefined) {
		return null
	}

	const ret = new proto.rover.protobuf.Version()

	if (typeof value === 'string') {
		const match = value.match(VersionRegex)
		

		if (match) {
			const version   = match[1].split('.').map(i => parseInt(i))
			const major 	= version[0]
			const minor 	= version[1]
			const revision 	= version[2]

			ret.setMajor(major)
			ret.setMinor(minor)
			ret.setRevision(revision)

		} else {
			throw new Error(`unrecognized input, must be in the form of ${VersionRegex} got: ${value.toString()}`)
		}
		
	} else if(typeof value === 'object') {
		const major 	= parseInt(value.major) 	? parseInt(value.major) : 0
		const minor 	= parseInt(value.minor) 	? parseInt(value.minor) : 0
		const revision 	= parseInt(value.revision || value.patch) 	? parseInt(value.revision || value.patch) : 0

		ret.setMajor(major)
		ret.setMinor(minor)
		ret.setRevision(revision)

	} else {
		throw new Error('unsupported value: ' + value.toString())
	}

	return ret
}

/**
 * Converts this Version object to a plain JavaScript string value.
 * @return {?proto.rover.protobuf.JavaScriptValue} a plain JavaScript
 *     value representing this Version object.
 */
proto.rover.protobuf.Version.prototype.toStringValue = function() {
	const major 	= this.getMajor()
	const minor 	= this.getMinor()
	const revision 	= this.getRevision()

	return `${major}.${minor}.${revision}`
}

/**
 * Converts this Version object to a plain JavaScript object value.
 * @return {?proto.rover.protobuf.JavaScriptValue} a plain JavaScript
 *     value representing this Version object.
 */
proto.rover.protobuf.Version.prototype.toObjectValue = function() {
	const major 	= this.getMajor()
	const minor 	= this.getMinor()
	const revision 	= this.getRevision()

	return {
		major: major,
		minor: minor,
		revision: revision
	}
}