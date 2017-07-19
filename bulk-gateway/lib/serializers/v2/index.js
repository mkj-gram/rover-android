const ProtoHelpers = require('@rover/apis').Helpers
const JobStatus = require('@rover/apis').csv_processor.v1.Models.JobStatus

function flattenSamples(samples) {
	return samples.map(sample => {
		return sample.getDataList()
	})
}

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

exports.csvFileProtoToJson = function(csvFileProto) {
	return {
		id: csvFileProto.getId().toString(),
		filename: csvFileProto.getFilename(),
		file_size: csvFileProto.getFileSize(),
		num_rows: csvFileProto.getNumRows(),
		num_columns: csvFileProto.getNumColumns(),
		samples: flattenSamples(csvFileProto.getSamplesList()),
		created_at: ProtoHelpers.timestampFromProto(csvFileProto.getCreatedAt()).toISOString()
	}
}

exports.loadJobProtoToJson = function(loadJob) {
	return {
        id: loadJob.getId().toString(),
        progress: loadJob.getProgress(),
        status: getJobStatusString(loadJob.getStatus()),
        created_at: ProtoHelpers.timestampFromProto(loadJob.getCreatedAt()).toISOString(),
        failed_reason: loadJob.getFailedReason()
    }
}