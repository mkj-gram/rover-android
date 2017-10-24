const Router = require('express').Router

/* Is used by /bulk/v2 */


module.exports = function(CsvProcessorClient, FilesClient, SegmentClient) {

	const router = Router()
	
	router.use(require('./csv-files')(FilesClient))
	router.use(require('./load-jobs')(CsvProcessorClient))
	router.use(require('./static-segments')(CsvProcessorClient, FilesClient, SegmentClient))
	router.use(require('./profile-imports')(CsvProcessorClient, FilesClient))
	
	return router
}