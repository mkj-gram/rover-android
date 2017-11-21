import RoverApis from '@rover/apis'

export const buildStringPredicate = ({
    attribute,
    stringComparison,
    stringValue
}) => {
    // IS_UNSET        = 0;
    // IS_SET          = 1;
    //
    // IS_EQUAL        = 2;
    // IS_NOT_EQUAL    = 3;
    //
    // STARTS_WITH  = 4;
    // ENDS_WITH    = 5;
    //
    // CONTAINS     = 6;
    // DOES_NOT_CONTAIN = 7;
    let comparison
    switch (stringComparison) {
        case 'is unset':
            comparison = 0
            break
        case 'is set':
            comparison = 1
            break
        case 'is':
            comparison = 2
            break
        case 'is not':
            comparison = 3
            break
        case 'starts with':
            comparison = 4
            break
        case 'ends with':
            comparison = 5
            break
        case 'contains':
            comparison = 6
            break
        case 'does not contain':
            comparison = 7
            break
        default:
            comparison = 1
    }
    let value = stringValue

    if (attribute === 'platform') {
        value = value.toUpperCase()
    }

    if (attribute === 'notification_authorization') {
        switch (value) {
            case 'Unknown':
                value = 'UNKNOWN'
                break
            case 'Not Determined':
                value = 'NOT_DETERMINED'
                break
            case 'Authorized':
                value = 'AUTHORIZED'
                break
            case 'Denied':
                value = 'DENIED'
                break
            default:
                value = 'UNKNOWN'
        }
    }

    if (attribute === 'push_environment') {
        value = value.toLowerCase()
    }

    const stringPredicate = new RoverApis.audience.v1.Models.StringPredicate()
    stringPredicate.setAttributeName(attribute)
    stringPredicate.setOp(comparison)
    stringPredicate.setValue(value)
    return stringPredicate
}
export const buildBoolPredicate = ({
    attribute,
    booleanComparison,
    booleanValue
}) => {
    // IS_UNSET        = 0;
    // IS_SET          = 1;
    //
    // IS_EQUAL        = 2;
    let comparison
    switch (booleanComparison) {
        case 'is unset':
            comparison = 0
            break
        case 'is set':
            comparison = 1
            break
        case 'is equal':
            comparison = 2
            break
        default:
            comparison = 1
    }
    const boolPredicate = new RoverApis.audience.v1.Models.BoolPredicate()
    boolPredicate.setAttributeName(attribute)
    boolPredicate.setOp(comparison)
    boolPredicate.setValue(booleanValue)
    return boolPredicate
}
export const buildNumberPredicate = ({
    attribute,
    numberComparison,
    numberValue
}) => {
    // IS_UNSET        = 0;
    // IS_SET          = 1;
    //
    // IS_EQUAL        = 2;
    // IS_NOT_EQUAL    = 3;
    //
    // IS_GREATER_THAN = 4;
    // IS_LESS_THAN    = 5;
    //
    // IS_BETWEEN      = 6;
    let comparison
    switch (numberComparison) {
        case 'is unset':
            comparison = 0
            break
        case 'is set':
            comparison = 1
            break
        case 'is equal':
            comparison = 2
            break
        case 'is not equal':
            comparison = 3
            break
        case 'is greater than':
            comparison = 4
            break
        case 'is less than':
            comparison = 5
            break
        case 'is between':
            comparison = 6
            break
        default:
            comparison = 1
    }
    const numberPredicate = new RoverApis.audience.v1.Models.NumberPredicate()
    numberPredicate.setAttributeName(attribute)
    numberPredicate.setOp(comparison)
    numberPredicate.setValue(numberValue[0])
    numberPredicate.setValue2(numberValue[1])
    return numberPredicate
}

export const buildFloatPredicate = ({
    attribute,
    floatComparison,
    floatValue
}) => {
    // IS_UNSET        = 0;
    // IS_SET          = 1;
    //
    // IS_EQUAL        = 2;
    // IS_NOT_EQUAL    = 3;
    //
    // IS_GREATER_THAN = 4;
    // IS_LESS_THAN    = 5;
    //
    // IS_BETWEEN      = 6;
    let comparison
    switch (floatComparison) {
        case 'is unset':
            comparison = 0
            break
        case 'is set':
            comparison = 1
            break
        case 'is equal':
            comparison = 2
            break
        case 'is not equal':
            comparison = 3
            break
        case 'is greater than':
            comparison = 4
            break
        case 'is less than':
            comparison = 5
            break
        case 'is between':
            comparison = 6
            break
        default:
            comparison = 1
    }
    const floatPredicate = new RoverApis.audience.v1.Models.DoublePredicate()
    floatPredicate.setAttributeName(attribute)
    floatPredicate.setOp(comparison)
    floatPredicate.setValue(floatValue[0])
    floatPredicate.setValue2(floatValue[1])
    return floatPredicate
}

export const buildDurationPredicate = ({
    attribute,
    dateComparison,
    dateValue
}) => {
    /*
        IS_GREATER_THAN = 0;
        IS_LESS_THAN     = 1;
        IS_EQUAL        = 2;
    */

    let comparison
    switch (dateComparison) {
        case 'is less than':
            comparison = 0
            break
        case 'is greater than':
            comparison = 1
            break
        case 'is equal':
            comparison = 2
            break
        default:
            comparison = 2
    }
    const { duration } = dateValue
    const durationPredicate = new RoverApis.audience.v1.Models
        .DurationPredicate()
    const value = new RoverApis.audience.v1.Models.DurationPredicate.Duration()

    // enum Type , DAYS = 0 . Set this as default
    value.setType(0)
    value.setDuration(parseInt(duration))

    durationPredicate.setAttributeName(attribute)
    durationPredicate.setOp(comparison)
    durationPredicate.setValue(value)

    return durationPredicate
}

export const buildDatePredicate = ({
    attribute,
    dateComparison,
    dateValue
}) => {
    /*
        IS_AFTER      = 0;
        IS_BEFORE     = 1;
        IS_ON         = 2;
        IS_SET        = 3;
        IS_UNSET      = 4;
    */
    let comparison
    switch (dateComparison) {
        case 'is unset':
            comparison = 0
            break
        case 'is set':
            comparison = 1
            break
        case 'is after':
            comparison = 2
            break
        case 'is before':
            comparison = 3
            break
        case 'is on':
            comparison = 4
            break
        default:
            comparison = 2
    }

    const { start, end } = dateValue
    const datePredicate = new RoverApis.audience.v1.Models.DatePredicate()
    const value = new RoverApis.audience.v1.Models.DatePredicate.Date()

    value.setDay(start.day)
    value.setMonth(start.month)
    value.setYear(start.year)

    datePredicate.setAttributeName(attribute)
    datePredicate.setOp(comparison)
    datePredicate.setValue(value)

    return datePredicate
}

export const buildVersionPredicate = ({
    attribute,
    versionComparison,
    versionValue
}) => {
    // IS_UNSET   = 0;
    // IS_SET     = 1;
    //
    // IS_OUTSIDE = 2;
    // IS_WITHIN  = 3;
    let comparison
    switch (versionComparison) {
        case 'is unset':
            comparison = 0
            break
        case 'is set':
            comparison = 1
            break
        case 'is equal':
            comparison = 2
            break
        case 'is not equal':
            comparison = 3
            break
        case 'is greater than':
            comparison = 4
            break
        case 'is less than':
            comparison = 5
            break
        case 'is between':
            comparison = 6
            break
        case 'is greater than or equal':
            comparison = 7
            break
        case 'is less than or equal':
            comparison = 8
            break
        default:
            comparison = 1
    }

    const versionPredicate = new RoverApis.audience.v1.Models.VersionPredicate()
    versionPredicate.setOp(comparison)
    versionPredicate.setAttributeName(attribute)

    const value = new RoverApis.audience.v1.Models.Version()
    const value2 = new RoverApis.audience.v1.Models.Version()

    value.setMajor(versionValue[0])
    value.setMinor(versionValue[1])
    value.setRevision(versionValue[2])

    value2.setMajor(versionValue[3])
    value2.setMinor(versionValue[4])
    value2.setRevision(versionValue[5])

    versionPredicate.setValue(value)
    versionPredicate.setValue2(value2)

    return versionPredicate
}

export const buildGeofencePredicate = ({
    attribute,
    geofenceComparison,
    geofenceValue
}) => {
    // IS_SET                   = 1;
    //
    // IS_OUTSIDE                 = 2;
    // IS_WITHIN             = 3;

    let comparison
    switch (geofenceComparison) {
        case 'is unset':
            comparison = 0
            break
        case 'is set':
            comparison = 1
            break
        case 'is outside':
            comparison = 2
            break
        case 'is within':
            comparison = 3
            break
        default:
            comparison = 1
    }
    const geofencePredicate = new RoverApis.audience.v1.Models
        .GeofencePredicate()
    const value = new RoverApis.audience.v1.Models.GeofencePredicate.Location()
    const { longitude, latitude, radius, name } = geofenceValue
    value.setLongitude(longitude)
    value.setLatitude(latitude)
    value.setRadius(radius)
    value.setName(name)
    geofencePredicate.setAttributeName(attribute)
    geofencePredicate.setOp(comparison)
    geofencePredicate.setValue(value)
    return geofencePredicate
}

export const buildStringArrayPredicate = ({
    attribute,
    stringArrayComparison,
    stringArrayValue
}) => {
    // IS_UNSET                 = 0;
    // IS_SET                   = 1;

    // CONTAINS_ANY             = 2;
    // DOES_NOT_CONTAIN_ANY     = 3;

    // CONTAINS_ALL            = 4;
    // DOES_NOT_CONTAIN_ALL    = 5;
    let comparison
    switch (stringArrayComparison) {
        case 'is unset':
            comparison = 0
            break
        case 'is set':
            comparison = 1
            break
        case 'contains any':
            comparison = 2
            break
        case 'does not contain any':
            comparison = 3
            break
        case 'contains all':
            comparison = 4
            break
        case 'does not contain all':
            comparison = 5
            break
        default:
            comparison = 1
    }
    const stringArrayPredicate = new RoverApis.audience.v1.Models
        .StringArrayPredicate()
    stringArrayPredicate.setAttributeName(attribute)
    stringArrayPredicate.setOp(comparison)
    stringArrayPredicate.setValueList(stringArrayValue)
    return stringArrayPredicate
}

const getPredicateSelector = string =>
    RoverApis.audience.v1.Models.Predicate.Selector[string]

const buildPredicates = predicates => {
    const parsedPredicates = JSON.parse(predicates)
    const predicateList = parsedPredicates.map(predicate => {
        let pred = new RoverApis.audience.v1.Models.Predicate()
        switch (predicate.__typename) {
            case 'StringPredicate':
                pred.setStringPredicate(buildStringPredicate(predicate))
                break
            case 'BooleanPredicate':
                pred.setBoolPredicate(buildBoolPredicate(predicate))
                break
            case 'NumberPredicate':
                pred.setNumberPredicate(buildNumberPredicate(predicate))
                break
            case 'FloatPredicate':
                pred.setDoublePredicate(buildFloatPredicate(predicate))
                break
            case 'DatePredicate':
                if (
                    ['is equal', 'is greater than', 'is less than'].includes(
                        predicate.dateComparison
                    )
                ) {
                    pred.setDurationPredicate(buildDurationPredicate(predicate))
                } else {
                    pred.setDatePredicate(buildDatePredicate(predicate))
                }
                break
            case 'VersionPredicate':
                pred.setVersionPredicate(buildVersionPredicate(predicate))
                break
            case 'GeofencePredicate':
                pred.setGeofencePredicate(buildGeofencePredicate(predicate))
                break
            case 'StringArrayPredicate':
                pred.setStringArrayPredicate(
                    buildStringArrayPredicate(predicate)
                )
        }
        pred.setSelector(getPredicateSelector(predicate.selector))
        return pred
    })
    return predicateList
}

export default (queryCondition, predicates) => {
    const predicateAggregate = new RoverApis.audience.v1.Models
        .PredicateAggregate()
    const condition = queryCondition === 'ANY' ? 0 : 1
    predicateAggregate.setCondition(condition)
    predicateAggregate.setPredicatesList(buildPredicates(predicates))
    return predicateAggregate
}
