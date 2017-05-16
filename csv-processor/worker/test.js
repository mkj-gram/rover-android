const kue = require('kue')
const Config = require('./config')

const queue = kue.createQueue({
    prefix: Config.get('/redis/prefix'),
    redis: Config.get('/redis/url')
});


queue.create('load-static-segment', {
    type: 0,
    account_id: 1,
    segment_id: 2,
    gcs_file: {
        project_id: 'rover-development',
        bucket: 'bulk-service',
        file_id: '07030c6f7c58030b443f43de86d3a75164b25c506f80ad84e54c807d2f994eef.csv'
    }
}).save(function(err) {
	if (err) {
		console.log("...")
	}

	console.log("DONE")
	process.exit(0)
})