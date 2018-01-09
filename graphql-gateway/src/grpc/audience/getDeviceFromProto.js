import RoverApis from '@rover/apis'
import { valueFromProto } from './getProfileFromProto'

export const getVersionFromProto = p => !!p ? [p.getMajor(), p.getMinor(), p.getRevision()] : []

export const getPlatformFromProto = p => {
    switch (p) {
        case 0:
            return ''
        case 1:
            return 'Mobile'
        case 2:
            return 'Web'
    }
}

export const getNotificationAuthorizationFromProto = p => {
    switch (p) {
        case 1:
            return 'Not Determined'
        case 2:
            return 'Authorized'
        case 3:
            return 'Denied'
        default:
            // TODO convert to null when front-end app can support
            return ''
    }
}


export const getPushEnvironmentFromProto = p => {
    return p.charAt(0).toUpperCase().concat(p.slice(1))
}

export const getCustomDeviceAttributes = d => {
    const attributes = d.getAttributesMap()

    return attributes.keys().arr_.map(key => ({
        attribute: key,
        selector: 'CUSTOM_DEVICE',
        value: valueFromProto(attributes.get(key))
    }))
}

export default (d) => {
    const props = {
        advertising_id: d.getAdvertisingId(),
        app_version: d.getAppVersion(),
        carrier_name: d.getCarrierName(),
        created_at: RoverApis.Helpers.timestampFromProto(d.getCreatedAt()),
        device_id: d.getDeviceId(),
        device_manufacturer: d.getDeviceManufacturer(),
        device_model: d.getDeviceModel(),
        ip: d.getIp(),
        is_background_enabled: d.getIsBackgroundEnabled(),
        is_bluetooth_enabled: d.getIsBluetoothEnabled(),
        is_cellular_enabled: d.getIsCellularEnabled(),
        is_location_monitoring_enabled: d.getIsLocationMonitoringEnabled(),
        is_test_device: d.getIsTestDevice(),
        is_wifi_enabled: d.getIsWifiEnabled(),
        label: d.getLabel(),
        locale_language: d.getLocaleLanguage(),
        locale_region: d.getLocaleRegion(),
        locale_script: d.getLocaleScript(),
        location_latitude: d.getLocationLatitude(),
        location_longitude: d.getLocationLongitude(),
        location_country: d.getLocationCountry(),
        location_state: d.getLocationState(),
        location_city: d.getLocationCity(),
        location_updated_at: RoverApis.Helpers.timestampFromProto(d.getLocationUpdatedAt()),
        notification_authorization: getNotificationAuthorizationFromProto(d.getNotificationAuthorization()),
        os_name: d.getOsName(),
        os_version: getVersionFromProto(d.getOsVersion()),
        platform: getPlatformFromProto(d.getPlatform()),
        profile_id: d.getProfileIdentifier(),
        push_environment: getPushEnvironmentFromProto(d.getPushEnvironment()),
        push_token_created_at: RoverApis.Helpers.timestampFromProto(d.getPushTokenCreatedAt()),
        push_token_is_active: d.getPushTokenIsActive(),
        push_token_key: d.getPushTokenKey(),
        push_token_updated_at: RoverApis.Helpers.timestampFromProto(d.getPushTokenUpdatedAt()),
        radio: d.getRadio(),
        region_monitoring_mode: d.getRegionMonitoringMode(),
        screen_height: d.getScreenHeight(),
        screen_width: d.getScreenWidth(),
        sdk_version: getVersionFromProto(d.getFrameworksMap().get('io.rover.Rover')),
        time_zone: d.getTimeZone()
    }

     return Object.keys(props).map(p => {
        return {
            attribute: p,
            selector: 'DEVICE',
            value: props[p]
        }
    }).concat(getCustomDeviceAttributes(d))
}
