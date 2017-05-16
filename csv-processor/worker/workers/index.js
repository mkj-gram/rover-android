const SegmentWorker = require('./segment-worker')


const init = function(context) {
	SegmentWorker.init(context)
}


module.exports = {
	init: init
}