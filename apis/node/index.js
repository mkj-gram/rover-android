const fs = require('fs')
const path = require('path')
const grpcServiceRegex = new RegExp(/.*grpc\_pb\.js/)

function getDirectories (srcpath, opts = {}) {
    const dirs = fs.readdirSync(srcpath).filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
    if (opts.exclude) {
        return dirs.filter(file => !opts.exclude.includes(file))
    }

    return dirs
}

function getJsFiles(srcpath) {
    return fs.readdirSync(srcpath).filter(file => file.endsWith("js"))
}


function isGrpcServiceFile(jsFile) {
    return jsFile.match(grpcServiceRegex)
}

function traverse(currentpath, dir) {

    const directories = getDirectories(currentpath, { exclude: ["node_modules"] })

    var glob = {}

    directories.forEach(directory => {
        glob[directory] = traverse(path.join(currentpath, directory), directory)
    })

    if (dir == ".") {
        return glob
    }

    const jsFiles = getJsFiles(currentpath)

    if (jsFiles.length == 0 || currentpath == __dirname) {
        return glob
    }

    glob["Models"] = {}
    glob["Services"] = {}

    jsFiles.forEach(jsFile => {

        var type;
        if (isGrpcServiceFile(jsFile)) {
           type = "Services"
        } else {
            type = "Models"
        }

        glob[type] = Object.assign(glob[type], require(path.join(currentpath, jsFile)))
    })

    return glob
}



const CommonModels = Object.assign({}, require('google-protobuf/google/protobuf/timestamp_pb.js'))

const HelperMethods = {
    timestampToProto: function(timestamp) {
        if (timestamp instanceof Date) {
            let proto = new CommonModels.Timestamp()
            let unixTime = timestamp.getTime()
            proto.setSeconds(Math.floor(unixTime / 1000 ))
            proto.setNanos(((unixTime % 1000) * 1000000))

            return proto
        }

        return undefined
    },
    timestampFromProto: function(timestamp) {
        if (timestamp instanceof CommonModels.Timestamp) {
            let milliseconds = timestamp.getSeconds() * 1000 + timestamp.getNanos() / (1000 * 1000)
            return new Date(milliseconds)
        }

        return undefined
    }
}
const definitions = Object.assign({ Models: CommonModels, Helpers: HelperMethods }, traverse(__dirname, __dirname))

module.exports = definitions