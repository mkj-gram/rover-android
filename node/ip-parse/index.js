const ipaddr = require('ipaddr.js')

const parseIP = (ip) => {
	if (ipaddr.IPv4.isValid(ip)) {
		return ip;
	} else if (ipaddr.IPv6.isValid(ip)) {
		let addr = ipaddr.IPv6.parse(ip);
		if (addr.isIPv4MappedAddress()) {
			return addr.toIPv4Address().toString()
		} else {
			// This is an IPv6 address already
			return ip;
		}
	} else {
		return undefined;
	}
}


module.exports = parseIP;