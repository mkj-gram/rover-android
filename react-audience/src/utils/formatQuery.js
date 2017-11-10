import { getDeviceOptions } from '../localSchemas/deviceSchema'
import moment from 'moment'

const formatStringPredicate = ({ typename, value, ...rest }) => {
    if (value === null || value === undefined || value === 'Unknown') {
        return null
    }

    return {
        stringComparison: 'is',
        stringValue: value,
        __typename: typename,
        ...rest
    }
}

const formatBoolPredicate = ({ typename, value, ...rest }) => {
    if (value === null || value === undefined || value === 'Unknown') {
        return null
    }
    return {
        booleanComparison: 'is equal',
        booleanValue: value,
        __typename: typename,
        ...rest
    }
}

const formatDatePredicate = ({ typename, value, ...rest }) => {
    if (value === null || value === undefined || value === 'Unknown') {
        return null
    }
    let m = moment(value)
    return {
        dateComparison: 'is on',
        dateValue: {
            start: {
                year: m.year(),
                month: m.month() + 1,
                day: m.date()
            }
        },
        __typename: typename,
        ...rest
    }
}

const formatVersionPredicate = ({ typename, value, ...rest }) => {
    if (value === null || value === undefined || value === 'Unknown') {
        return null
    }
    return {
        versionComparison: 'is equal',
        versionValue: value.split('.'),
        __typename: typename,
        ...rest
    }
}

const formatNumberPredicate = ({ typename, value, ...rest }) => {
    if (value === null || value === undefined || value === 'Unknown') {
        return null
    }
    return {
        numberComparison: 'is equal',
        numberValue: [value],
        __typename: typename,
        ...rest
    }
}

const formatFloatPredicate = ({ typename, value, ...rest }) => {
    if (value === null || value === undefined || value === 'Unknown') {
        return null
    }
    return {
        floatComparison: 'is equal',
        floatValue: [value],
        __typename: typename,
        ...rest
    }
}

const formatStringArrayPredicate = ({ typename, value, ...rest }) => {
    if (value === null || value === undefined || value === 'Unknown') {
        return null
    }
    return {
        stringArrayComparison: 'contains all',
        stringArrayValue: value,
        __typename: typename,
        ...rest
    }
}

const formatQuery = properties => {
    // Get Options for devices
    let rest = {
        ...properties
    }
    if (properties.selector === 'DEVICE') {
        let options = getDeviceOptions(properties.attribute)
        rest = {
            ...properties,
            options: options ? options : []
        }
    }

    switch (properties.typename) {
        case 'BooleanPredicate':
            return formatBoolPredicate({ ...rest })
            break
        case 'DatePredicate':
            return formatDatePredicate({ ...rest })
            break
        case 'VersionPredicate':
            return formatVersionPredicate({ ...rest })
            break
        case 'StringPredicate':
            return formatStringPredicate({ ...rest })
            break
        case 'NumberPredicate':
            return formatNumberPredicate({ ...rest })
            break
        case 'GeofencePredicate':
            return formatGeofencePredicate({ ...rest })
            break
        case 'FloatPredicate':
            return formatFloatPredicate({ ...rest })
            break
        case 'StringArrayPredicate':
            return formatStringArrayPredicate({ ...rest })
            break
        default:
            return null
    }
}

export default formatQuery
