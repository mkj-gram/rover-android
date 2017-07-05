const JobStatus = require('@rover/apis')['csv-processor'].v1.Models.JobStatus

const getJobStatusString = function(job_state) {
    switch(job_state) {
        case JobStatus.ENQUEUED:
            return "enqueued"
        case JobStatus.PROCESSING:
            return "processing"
        case JobStatus.FAILED:
            return "failed"
        case JobStatus.COMPLETED:
            return "completed"
        default:
            return "unknown"
    }
}

const serializeLoadJob = function(loadJob, format) {


    // Converts seconds to milliseconds and adds nanoseconds converted to milliseconds
    let createdAt = loadJob.getCreatedAt().getSeconds() * 1000 + loadJob.getCreatedAt().getNanos() / (1000 * 1000)

    return {
        id: loadJob.getId().toString(),
        type: "load-jobs",
        attributes: {
            'format': format,
            'progress': loadJob.getProgress(),
            'status': getJobStatusString(loadJob.getStatus()),
            'created-at': new Date(createdAt).toISOString()
        }
    }
}


module.exports = {
	serializeLoadJob: serializeLoadJob
}