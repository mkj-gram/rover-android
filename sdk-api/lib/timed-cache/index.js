class TimedCache {
	
	constructor() {
		this._cache = {};
	}

	get(key) {
		
		let item = this._cache[key];

		if (item) {
			if (Date.now() - item.generated > item.expiresIn) {
				delete this._cache[key];
				return undefined;
			} else {
				return item.value;
			}
		} else {
			return undefined;
		}
	}

	set(key, value, expiresIn) {
		this._cache[key] = {
			generated: Date.now(),
			value: value,
			expiresIn: expiresIn
		};
		return;
	}
}

module.exports = TimedCache;