const Router = require('express').Router

/* Is used by /bulk/v2 */


module.exports = function(CsvProcessorClient, FilesClient) {

	const router = Router()
	
	router.use(require('./csv-files')(FilesClient))
	
	return router
}