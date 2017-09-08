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
    const stringPredicate = new RoverApis.audience.v1.Models.StringPredicate()
    stringPredicate.setAttributeName(attribute)
    stringPredicate.setOp(comparison)
    stringPredicate.setValue(stringValue)
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
export const buildDatePredicate = ({
    attribute,
    dateComparison,
    dateValue
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
    // IS_AFTER        = 7;
    // IS_BEFORE       = 8;
    // IS_ON           = 9;
    let comparison
    switch (dateComparison) {
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
    const { start, end } = dateValue
    const dateStart = new Date(start)
    const dateEnd =new Date(end)
    const datePredicate = new RoverApis.audience.v1.Models.DatePredicate()
    datePredicate.setAttributeName(attribute)
    datePredicate.setOp(comparison)
    datePredicate.setValue(RoverApis.Helpers.timestampToProto(dateStart))
    datePredicate.setValue2(RoverApis.Helpers.timestampToProto(dateEnd))
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

    value.setMajor(versionValue[0][0])
    value.setMinor(versionValue[0][1])
    value.setRevision(versionValue[0][2])

    if (versionValue[1]) {
        value2.setMajor(versionValue[1][0])
        value2.setMinor(versionValue[1][1])
        value2.setRevision(versionValue[1][2])
    }

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
export const buildPredicateAggregate = (queryCondition, predicates) => {
    const predicateAggregate = new RoverApis.audience.v1.Models
        .PredicateAggregate()
    const condition = queryCondition === 'ANY' ? 0 : 1
    predicateAggregate.setCondition(condition)
    predicateAggregate.setPredicatesList(buildPredicates(predicates))
    return predicateAggregate
}
export const buildPredicates = (predicates) => {
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
            case 'DatePredicate':
                pred.setDatePredicate(buildDatePredicate(predicate))
                break
            case 'VersionPredicate':
                pred.setVersionPredicate(buildVersionPredicate(predicate))
                break
            case 'GeofencePredicate':
                pred.setGeofencePredicate(buildGeofencePredicate(predicate))
                break
        }
        pred.setModel(1)
        return pred
    })
    return predicateList
}

//------------------------- Retrieve Profile Values from Proto ----------------------------------//
const valueFromProto = (value) => {
     switch (value.getValueTypeCase()) {
        case 1: {
            return value.getBooleanValue()
        }
        case 2: {
            return value.getIntegerValue()
        }
        case 3: {
            return value.getDoubleValue()
        }
        case 4: {
            return value.getStringValue()
        }
        case 5: {
            return value.getStringArrayValue().getValuesList()
        }
        case 7: {
            return null
        }
        case 8: {
            return RoverApis.Helpers.timestampFromProto(value.getTimestampValue())
        }
        default: {
            return undefined
        }
    }
}

const getRoverProfileValues = (id, p) => {
    const props = {
        id,
        account_id: p.getAccountId(),
        identifier: p.getIdentifier() === "" ? null : p.getIdentifier(),
        updated_at: RoverApis.Helpers.timestampFromProto(p.getUpdatedAt()),
        created_at: RoverApis.Helpers.timestampFromProto(p.getCreatedAt())
    }

    let rover_profiles = []

    Object.keys(props).forEach(property => {
        rover_profiles.push({
            attribute: property,
            category: 'rover_profile',
            value: props[property]
        })
    })
    return rover_profiles
}

const getCustomProfileValues = (p) => {
    const attributes = p.getAttributesMap()
    let custom_profiles = []

    attributes.keys().arr_.forEach(key => {
        custom_profiles.push({
            attribute: key,
            category: 'custom_profile',
            value: valueFromProto(attributes.get(key))
        })
    })
    return custom_profiles
}

export const profileFromProto = (profiles, p) => {
    const id = p.getId()
    profiles[id] = getRoverProfileValues(id, p).concat(getCustomProfileValues(p))
}

//------------------------------------------------------------------------------------------------

//------------------------- Retrieve Device Values from Proto ----------------------------------//
export const deviceFromProto = (devices, d) => {
    devices[d.getProfileId()] = []

    const props = {
        created_at: RoverApis.Helpers.timestampFromProto(d.getCreatedAt()),
        app_version: d.getAppVersion(),
        device_manufacturer: d.getDeviceManufacturer(),
        device_model: d.getDeviceModel(),
        os_name: d.getOsName(),
        locale_language: d.getLocaleLanguage(),
        locale_region: d.getLocaleRegion(),
        locale_script: d.getLocaleScript(),
        is_wifi_enabled: d.getIsWifiEnabled(),
        is_cellular_enabled: d.getIsCellularEnabled(),
        screen_width: d.getScreenWidth(),
        screen_height: d.getScreenHeight(),
        carrier_name: d.getCarrierName(),
        radio: d.getRadio(),
        time_zone: d.getTimeZone(),
        is_bluetooth_enabled: d.getIsBluetoothEnabled(),
        advertising_id: d.getAdvertisingId(),
        ip: d.getIp(),
        location_latitude: d.getLocationLatitude(),
        location_longitude: d.getLocationLongitude(),
        os_version: d.getOsVersion().array,
        sdk_version: d.getFrameworksMap().get('io.rover.Rover').array,
        device_id: d.getDeviceId(),
        is_test_device: d.getIsTestDevice(),
        platform: d.getPlatform(),
        profile_id: d.getProfileId(),
        push_token_is_active: d.getPushTokenIsActive(),
        region_monitoring_mode: d.getRegionMonitoringMode(),
        is_background_enabled: d.getIsBackgroundEnabled(),
        is_location_monitoring_enabled: d.getIsLocationMonitoringEnabled()
    }

    devices[d.getProfileId()] = Object.keys(props).map(p => {
        return {
            attribute: p,
            category: 'device',
            value: props[p]
        }
    })
}
//------------------------------------------------------------------------------------------------
