const RoverApis = require('@rover/apis')
const util = require('util')
const moment = require('moment')


function isInteger(n) {
	return Number(n) === n && n % 1 === 0
}

function isFloat(n) {
	return Number(n) === n && n % 1 !== 0
}


function valueToProto(value) {
    const protoValue = new RoverApis.audience.v1.Models.Value()

    if(util.isBoolean(value)) {
        protoValue.setBooleanValue(value)
    } else if(isFloat(value)) {
        protoValue.setDoubleValue(value)
    } else if(isInteger(value)) {
        protoValue.setIntegerValue(value)
    } else if(moment(value, moment.ISO_8601).isValid()) {
        protoValue.setTimestampValue(RoverApis.Helpers.timestampToProto(new Date(value)))
    } else if(util.isString(value)) {
        protoValue.setStringValue(value)
    } else if(value === null) {
        protoValue.setNullValue(RoverApis.audience.v1.Models.Null.NULL)
    } else if(util.isArray(value)) {
        const strings  = value.filter(v => { return util.isString(v) })
        const stringArray = new RoverApis.audience.v1.Models.Value.StringArray()
        stringArray.setValuesList(strings)
        protoValue.setStringArrayValue(stringArray)
    } else {
      return null
    }

    return protoValue
}

module.exports = {
	attributes: function(attr, map) {
		Object.entries(attr).forEach((i) => {
            const key = i[0]
            const value = valueToProto(i[1])
            if (value) {
                map.set(key, value)
            }
		})
	},
    boolean: function(v) {
        if (v === null || v === undefined) {
            return null
        }

        let proto = new RoverApis.protobuf.Models.BoolValue()
        proto.setValue(v)

        return proto
    },
    platform: function(v) {
        switch (v) {
            case "MOBILE":
                return RoverApis.audience.v1.Models.Platform.Value.MOBILE
            case "WEB":
                return RoverApis.audience.v1.Models.Platform.Value.WEB
            default:
                return RoverApis.audience.v1.Models.Platform.Value.UNKNOWN
        }
        
    }
}