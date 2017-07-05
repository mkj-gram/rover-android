const Router = require('express').Router



/* Is used by /bulk and /bulk/v1 */


module.exports = function(CsvProcessorClient, UploaderClient) {

	const router = Router()

	router.use(require('./segments')(CsvProcessorClient, UploaderClient))
	router.use(require('./load-jobs')(CsvProcessorClient))
	
	return router
}