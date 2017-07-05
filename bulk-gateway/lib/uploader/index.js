const Uploader = function(storage, opts) {
    const gcs = storage({
        projectId: opts.projectId,
        credentials: opts.credentials
    })

    this._bucket = gcs.bucket(opts.bucketName)
}

Uploader.prototype.upload = function(req, filename, callback) {
    
    const file = this._bucket.file(filename)
    const remoteWriteStream = file.createWriteStream({ resumable: false })

    remoteWriteStream.on('finish', function() {
        return callback(null, file)
    }).on('error', function(err) {
        console.error(err)
        return callback(err)
    })

    req.on('error', function(err) {
        console.error(err);
        return callback(err)
    }).on('data', function(chunk) {
        remoteWriteStream.write(chunk)
    }).on('end', function() {
        remoteWriteStream.end()
    })
};

Uploader.prototype.cleanUp = function(gcsfile, callback) {
    
    const file = this._bucket.file(gcsfile.id)

    file.delete(function(err, apiResponse) {
        return callback(err)
    })
};

Uploader.prototype.connect = function(callback) {
    this._bucket.exists()
        .then(data => {
            const exists = data[0]
            if (!exists) {
                console.log("Uploader: creating bucket: " + this._bucket.id)
                return this._bucket.create()
                        .then(newBucket => {
                            console.log(newBucket)
                            return callback()
                        })
                        .catch(err => { return callback(err) })
            }

            console.log("Uploader: bucket:= `" + this._bucket.id + "` already exists")
            return callback()
        })
        .catch(err => { return callback(err) })
};


module.exports = Uploader