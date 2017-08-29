export const getDeviceSchema = () => [
        {
            attribute: 'created_at',
            label: 'First Seen',
            __typename: 'DatePredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'push_token_is_active',
            label: 'push_token_is_active',  // Need label
            __typename: 'BooleanPredicate',
            group: null,
            display: false,
            filter: true
        },
        {
            attribute: 'app_version',
            label: 'App Version',
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'device_manufacturer',
            label: 'Hardware Manufacturer',
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'device_model',
            label: 'Hardware Model',
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'os_name',
            label: 'Operating System',
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'locale_language',
            label: 'Locale Language',
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'locale_region',
            label: 'Locale Region',
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'locale_script',
            label: 'Locale Script',
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'is_wifi_enabled',
            label: 'Wifi',
            __typename: 'BooleanPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'is_cellular_enabled',
            label: 'Cellular',
            __typename: 'BooleanPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'screen_width',
            label: 'Screen Width',
            __typename: 'NumberPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'screen_height',
            label: 'Screen Height',
            __typename: 'NumberPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'carrier_name',
            label: 'Carrier Name',
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'radio',
            label: 'Radio', // Need label
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: false
        },
        {
            attribute: 'time_zone',
            label: 'Time Zone',
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'is_background_enabled', 
            label: 'is_background_enabled', // Need label
            __typename: 'BooleanPredicate',
            group: null,
            display: false,
            filter: true
        },
        {
            attribute: 'is_location_monitoring_enabled', 
            label: 'is_location_monitoring_enabled', // Need label
            __typename: 'BooleanPredicate',
            group: null,
            display: false,
            filter: true
        },
        {
            attribute: 'is_bluetooth_enabled',
            label: 'Bluetooth', 
            __typename: 'BooleanPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'advertising_id',
            label: 'Advertising ID', 
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: false
        },
        {
            attribute: 'ip',
            label: 'IP Address', 
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'location',
            label: 'Location', 
            __typename: 'GeofencePredicate',
            group: null,
            display: false,
            filter: true
        },
        {
            attribute: 'location_latitude',
            label: 'Latitude', 
            __typename: 'FloatPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'location_longitude',
            label: 'Longitude', 
            __typename: 'FloatPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'os_version',
            label: 'OS Version',
            __typename: 'VersionPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'sdk_version',
            label: 'SDK Version',
            __typename: 'VersionPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'device_id',
            label: 'Device ID',
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'platform',
            label: 'Platform',
            __typename: 'StringPredicate',
            group: null,
            display: true,
            filter: true
        },
        {
            attribute: 'region_monitoring_mode',
            label: 'region_monitoring_mode', // Need label
            __typename: 'StringPredicate',
            group: null,
            display: false,
            filter: true
        }
        // {
        //     attribute: 'is_test_device',
        //     label: 'is_test_device',   // Update when working on test device Milestone
        //     __typename: 'BooleanPredicate',
        //     group: null,
        //     display: true,
        //     filter: true
        // },
    ]

const getDeviceSchemaGroups = () => ['location', 'os', 'pushToken'] // ToDo: Update List

export const getDeviceSchemaColumns = () => {
    const columns = {
        devices: {}
    }
    getDeviceSchemaGroups().forEach(group => {
        columns[group] = {}
    })
    getDeviceSchema().forEach(property => {
        if (property.display !== false) {
            const { attribute, ...rest } = property
            if (property.group === null) {
                columns.devices[property.attribute] = { ...rest }
            } else {
                columns[property.group][property.attribute] = { ...rest }
            }
        }
    })
    return columns
}

export const getDeviceLabel = (attribute) => {

    const findLabel = (property) => {
        return property.attribute === attribute 
    }
    let obj = getDeviceSchema().find(findLabel)
    if (obj) {
        return obj.label
    } else {
        return property.attribute
    }
  
}