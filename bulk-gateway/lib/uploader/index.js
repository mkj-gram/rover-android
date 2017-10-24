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
    var self = this
    var called = false
    /*
        Google error. If an error occurs it calls the callback function multiple times
     */
    this._bucket.exists(function(err, exists) {
        if (called === true) {
            return
        }

        if (err) {
            called = true
            return callback(err)
        }

        if (!exists) {
            called = true
            return callback(new Error(`Bucket not found: ${self._bucket.name}`))
        }

        called = true
        return callback()
    })
};


module.exports = Uploader