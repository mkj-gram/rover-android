var expect = require('chai').expect
const Serializers = require('../../lib/serializers')
const RoverApis = require("@rover/apis")
const CsvProcessor = RoverApis['csv-processor']

const utils = require('../support/utils')



describe('serializeLoadJob', function() {

    const testCases = [
        {
            description: "correctly maps a protobuf load job to json",
            input: ["1", 100, CsvProcessor.v1.Models.JobStatus.COMPLETED, new Date('2017-06-27T19:13:03.100Z')],
            output: {
                "id": "1",
                "type": "load-jobs",
                "attributes": {
                    "created-at": "2017-06-27T19:13:03.100Z",
                    "format": "csv",
                    "progress": 100, 
                    "status": "completed"
                }
            }
        },
        {
            description: "maps JobStatus.ENQUEUED to enqueued",
            input: ["1", 100, CsvProcessor.v1.Models.JobStatus.ENQUEUED, new Date('2017-06-27T19:13:03.100Z')],
            output: {
                "id": "1",
                "type": "load-jobs",
                "attributes": {
                    "created-at": "2017-06-27T19:13:03.100Z",
                    "format": "csv",
                    "progress": 100, 
                    "status": "enqueued"
                }
            }
        },
        {
            description: "maps JobStatus.PROCESSING to processing",
            input: ["1", 100, CsvProcessor.v1.Models.JobStatus.PROCESSING, new Date('2017-06-27T19:13:03.100Z')],
            output: {
                "id": "1",
                "type": "load-jobs",
                "attributes": {
                    "created-at": "2017-06-27T19:13:03.100Z",
                    "format": "csv",
                    "progress": 100, 
                    "status": "processing"
                }
            }
        },
        {
            description: "maps JobStatus.FAILED to processing",
            input: ["1", 100, CsvProcessor.v1.Models.JobStatus.FAILED, new Date('2017-06-27T19:13:03.100Z')],
            output: {
                "id": "1",
                "type": "load-jobs",
                "attributes": {
                    "created-at": "2017-06-27T19:13:03.100Z",
                    "format": "csv",
                    "progress": 100, 
                    "status": "failed"
                }
            }
        },
        {
            description: "maps JobStatus.COMPLETED to processing",
            input: ["1", 100, CsvProcessor.v1.Models.JobStatus.COMPLETED, new Date('2017-06-27T19:13:03.100Z')],
            output: {
                "id": "1",
                "type": "load-jobs",
                "attributes": {
                    "created-at": "2017-06-27T19:13:03.100Z",
                    "format": "csv",
                    "progress": 100, 
                    "status": "completed"
                }
            }
        },
        {
            description: "defaults to unknown job status if nothing is provided",
            input: ["1", 100, CsvProcessor.v1.Models.JobStatus.COMPLETED, new Date('2017-06-27T19:13:03.100Z')],
            output: {
                "id": "1",
                "type": "load-jobs",
                "attributes": {
                    "created-at": "2017-06-27T19:13:03.100Z",
                    "format": "csv",
                    "progress": 100, 
                    "status": "completed"
                }
            }
        },
        {
            description: "maps job id",
            input: ["12", 100, CsvProcessor.v1.Models.JobStatus.COMPLETED, new Date('2017-06-27T19:13:03.100Z')],
            output: {
                "id": "12",
                "type": "load-jobs",
                "attributes": {
                    "created-at": "2017-06-27T19:13:03.100Z",
                    "format": "csv",
                    "progress": 100, 
                    "status": "completed"
                }
            }
        },
        {
            description: "maps job progress",
            input: ["1", 11, CsvProcessor.v1.Models.JobStatus.PROCESSING, new Date('2017-06-27T19:13:03.100Z')],
            output: {
                "id": "1",
                "type": "load-jobs",
                "attributes": {
                    "created-at": "2017-06-27T19:13:03.100Z",
                    "format": "csv",
                    "progress": 11, 
                    "status": "processing"
                }
            }
        },
        {
            description: "preserves date iso string",
            input: ["1", 11, CsvProcessor.v1.Models.JobStatus.PROCESSING, new Date('2012-06-27T11:02:03.123Z')],
            output: {
                "id": "1",
                "type": "load-jobs",
                "attributes": {
                    "created-at": "2012-06-27T11:02:03.123Z",
                    "format": "csv",
                    "progress": 11, 
                    "status": "processing"
                }
            }
        }
    ]

    testCases.forEach(test => {
        it(test.description, function() {
            let job = utils.buildJobProto.apply(null, test.input)

            let json = Serializers.v1.serializeLoadJob(job, 'csv')

            expect(json).to.be.an('object')
            expect(json).to.deep.equal(test.output)

        });
    })

})