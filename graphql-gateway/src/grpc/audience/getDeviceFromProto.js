import RoverApis from '@rover/apis'

const getVersionFromProto = p => !!p ? [p.getMajor(), p.getMinor(), p.getRevision()] : []

const getPlatformFromProto = p => {
    switch (p) {
        case 0:
            return 'UNDEFINED'
        case 1:
            return 'MOBILE'
        case 2:
            return 'WEB'
    }
}

export default (devices, d) => {
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
        os_version: getVersionFromProto(d.getOsVersion()),
        sdk_version: getVersionFromProto(d.getFrameworksMap().get('io.rover.Rover')),
        device_id: d.getDeviceId(),
        is_test_device: d.getIsTestDevice(),
        platform: getPlatformFromProto(d.getPlatform()),
        profile_id: d.getProfileId(),
        push_token_is_active: d.getPushTokenIsActive(),
        region_monitoring_mode: d.getRegionMonitoringMode(),
        is_background_enabled: d.getIsBackgroundEnabled(),
        is_location_monitoring_enabled: d.getIsLocationMonitoringEnabled(),
        push_environment: d.getPushEnvironment(),
        push_token_key: d.getPushTokenKey(),
        push_token_created_at: RoverApis.Helpers.timestampFromProto(d.getPushTokenCreatedAt()),
        push_token_updated_at: RoverApis.Helpers.timestampFromProto(d.getPushTokenUpdatedAt())
    }

    devices[d.getProfileId()] = Object.keys(props).map(p => {
        return {
            attribute: p,
            selector: 'DEVICE',
            value: props[p]
        }
    })
}
