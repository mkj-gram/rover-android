const moment = require('moment')
moment.suppressDeprecationWarnings = true

proto.rover.protobuf.Timestamp.fromISOString = function(value) {
	const time = moment.parseZone(value)
	if (!time.isValid()) {
		throw new Error("invalid timestamp value")
	}

	// number of seconds east of UTC
	const offset = time.utcOffset() * 60
	// Unix in milliseconds
	const unix = time.format('x')
	const timestamp = new proto.rover.protobuf.Timestamp()

	timestamp.setSeconds(Math.floor(unix / 1000))
	timestamp.setNanos(((unix % 1000) * 1000000))
	timestamp.setUtcOffset(offset)

	return timestamp
}

proto.rover.protobuf.Timestamp.prototype.toMoment = function() {
	const timestamp = this
	const unix = timestamp.getSeconds() * 1000 + timestamp.getNanos() / (1000 * 1000)
	const offset = timestamp.getUtcOffset()

	return moment(unix, "x").utcOffset(Math.floor(offset / 60))
}


proto.rover.protobuf.Timestamp.prototype.toISOString = function() {
	return this.toMoment().toISOString()	
}

proto.rover.protobuf.Timestamp.prototype.toDate = function() {
	return this.toMoment().toDate()
}