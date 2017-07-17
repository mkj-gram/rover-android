const ProtoHelpers = require('@rover/apis').Helpers

function flattenSamples(samples) {
	return samples.map(sample => {
		return sample.getDataList()
	})
}

exports.csvFileProtoToJson = function(csvFileProto) {
	return {
		id: csvFileProto.getId().toString(),
		type: "csv-files",
		attributes: {
			'filename': csvFileProto.getFilename(),
			'file-size': csvFileProto.getFileSize(),
			'num-rows': csvFileProto.getNumRows(),
			'num-columns': csvFileProto.getNumColumns(),
			'samples': flattenSamples(csvFileProto.getSamplesList()),
			'created-at': ProtoHelpers.timestampFromProto(csvFileProto.getCreatedAt()).toISOString()
		}
	}
}