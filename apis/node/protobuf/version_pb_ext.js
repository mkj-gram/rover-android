/**
 * 	Extensions added to proto.rover.protobuf.Version
 */



const VersionRegex = /^\d+\.\d+\.\d+$|^\d+\.\d+$/
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
		if (value.match(VersionRegex)) {
			const parts = value.split('.')
			const major 	= parseInt(parts[0]) ? parseInt(parts[0]) : 0
			const minor 	= parseInt(parts[1]) ? parseInt(parts[1]) : 0
			const revision 	= parseInt(parts[2]) ? parseInt(parts[2]) : 0

			ret.setMajor(major)
			ret.setMinor(minor)
			ret.setRevision(revision)

		} else {
			throw new Error('unrecognized input, must be in the form of (^\d+\.\d+\.\d+$|^\d+\.\d+$) got: \"' + value.toString() + "\"")
		}
		
	} else if(typeof value === 'object') {
		const major 	= parseInt(value.major) 	? parseInt(value.major) : 0
		const minor 	= parseInt(value.minor) 	? parseInt(value.minor) : 0
		const revision 	= parseInt(value.revision) 	? parseInt(value.revision) : 0

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