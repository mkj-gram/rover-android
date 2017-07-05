const RoverApis = require("@rover/apis")

exports.fromObject = fromObject
exports.buildJobProto = buildJobProto

function camelCase(str) {
	return str.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();        
    });
}

function fromObject(model, obj) {
	Object.keys(obj).forEach(key => {
		let method = camelCase(`set_${key}`)
		if (model && typeof model[method] === "function") {
			model[method](obj[key])
		} else {
			console.warn("Method: " + method + " cannot be set")
		}
	})
}


const buildTimestamp = function(date) {
    if (date instanceof Date) {
        let timestamp = new RoverApis.Models.Timestamp()
        let unixTime = date.getTime()
        timestamp.setSeconds(Math.floor(unixTime / 1000 ))
        timestamp.setNanos(((unixTime % 1000) * 1000000))

        return timestamp

    } else {
        return undefined
    }
}

function buildJobProto(id, progress, status, createdAt) {
    let job = new RoverApis['csv-processor'].v1.Models.LoadJob()
    job.setId(id)
    job.setProgress(progress)
    job.setStatus(status)
    job.setCreatedAt(buildTimestamp(createdAt))

    return job
}