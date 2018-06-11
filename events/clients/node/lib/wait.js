var Wait = function() {
	this._waiting = {}
}

Wait.prototype.notify = function(key, err) {
	let waiter = this._waiting[key]
	if (waiter) {
		delete this._waiting[key]
		process.nextTick(function(){
			waiter(err)
		})
	}
}

Wait.prototype.on = function(/* key{string}, timeout{integer}, cb{function(err)} */) {
	let key, timeout, cb

	if (arguments.length >= 3) {
		// Timeout was specified
		key = arguments[0]
		timeout = arguments[1]
		cb = arguments[2]
	} else {
		key = arguments[0]
		cb = arguments[1]
	}

	this._waiting[key] = cb

	if (timeout) {
		setTimeout(() => this.signal(key, new Error("timeout"), timeout))
	}
}

module.exports = Wait