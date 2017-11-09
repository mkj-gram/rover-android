/* eslint-disable no-else-return */
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
        attribute: 'device_id',
        label: 'Device Identifier',
        __typename: 'StringPredicate',
        group: null,
        display: true,
        filter: true
    },
    {
        attribute: 'push_token_key',
        label: 'Push Token',
        __typename: 'StringPredicate',
        group: null,
        display: true,
        filter: true
    },
    {
        attribute: 'push_environment',
        label: 'Push Environment',
        __typename: 'StringPredicate',
        group: null,
        display: true,
        filter: true,
        options: ['Production', 'Development']
    },
    {
        attribute: 'push_token_created_at',
        label: 'Push Token Created At',
        __typename: 'DatePredicate',
        group: null,
        display: true,
        filter: true
    },
    {
        attribute: 'push_token_updated_at',
        label: 'Push Token Updated At',
        __typename: 'DatePredicate',
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
        filter: true,
        popularStringOption: true
    },
    {
        attribute: 'device_model',
        label: 'Hardware Model',
        __typename: 'StringPredicate',
        group: null,
        display: true,
        filter: true,
        popularStringOption: true
    },
    {
        attribute: 'os_name',
        label: 'Operating System',
        __typename: 'StringPredicate',
        group: null,
        display: true,
        filter: true,
        popularStringOption: true
    },
    {
        attribute: 'locale_language',
        label: 'Locale Language',
        __typename: 'StringPredicate',
        group: null,
        display: true,
        filter: true,
        popularStringOption: true
    },
    {
        attribute: 'locale_region',
        label: 'Locale Region',
        __typename: 'StringPredicate',
        group: null,
        display: true,
        filter: true,
        popularStringOption: true
    },
    {
        attribute: 'carrier_name',
        label: 'Carrier Name',
        __typename: 'StringPredicate',
        group: null,
        display: true,
        filter: true,
        popularStringOption: true
    },

    {
        attribute: 'time_zone',
        label: 'Time Zone',
        __typename: 'StringPredicate',
        group: 'location',
        display: true,
        filter: true,
        popularStringOption: true
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
        group: 'location',
        display: true,
        filter: true
    },
    {
        attribute: 'location_longitude',
        label: 'Longitude',
        __typename: 'FloatPredicate',
        group: 'location',
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
        attribute: 'platform',
        label: 'Platform',
        __typename: 'StringPredicate',
        group: null,
        display: true,
        filter: true,
        options: ['Mobile', 'Web']
    },
    {
        attribute: 'is_test_device',
        label: 'Test Device', // Update when working on test device Milestone
        __typename: 'BooleanPredicate',
        group: null,
        display: true,
        filter: true
    },
    {
        attribute: 'label',
        label: 'Test Device Name', // Update when working on test device Milestone
        __typename: 'StringPredicate',
        group: null,
        display: true,
        filter: false
    }
    // ----------------------------
    //
    // The following device attributes will be unlocked for SDK2.x
    //
    // -----------------------------
    // {
    //     attribute: 'locale_script',
    //     label: 'Locale Script',
    //     __typename: 'StringPredicate',
    //     group: null,
    //     display: false,
    //     filter: false
    // },
    // {
    //     attribute: 'is_wifi_enabled',
    //     label: 'Wifi',
    //     __typename: 'BooleanPredicate',
    //     group: null,
    //     display: false,
    //     filter: false
    // },
    // {
    //     attribute: 'is_cellular_enabled',
    //     label: 'Cellular',
    //     __typename: 'BooleanPredicate',
    //     group: null,
    //     display: false,
    //     filter: false
    // },
    // {
    //     attribute: 'screen_width',
    //     label: 'Screen Width',
    //     __typename: 'NumberPredicate',
    //     group: null,
    //     display: false,
    //     filter: false
    // },
    // {
    //     attribute: 'screen_height',
    //     label: 'Screen Height',
    //     __typename: 'NumberPredicate',
    //     group: null,
    //     display: false,
    //     filter: false
    // },
    // {
    //     attribute: 'radio',
    //     label: 'Radio',
    //     __typename: 'StringPredicate',
    //     group: null,
    //     display: false,
    //     filter: false
    // },
    // {
    //     attribute: 'app_version',
    //     label: 'App Version',
    //     __typename: 'StringPredicate',
    //     group: null,
    //     display: false,
    //     filter: false
    // },
]

const getDeviceSchemaGroups = () => ['location']

export const getDeviceSchemaColumns = () => {
    const columns = {
        devices: {}
    }
    getDeviceSchemaGroups().forEach((group) => {
        columns[group] = {}
    })
    getDeviceSchema().forEach((property) => {
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
    const findLabel = property => property.attribute === attribute
    const obj = getDeviceSchema().find(findLabel)
    if (obj) {
        return obj.label
    } else {
        return attribute
    }
}

export const getDeviceOptions = (attribute) => {
    const obj = getDeviceSchema().find(device => attribute === device.attribute)
    if (obj) {
        return obj.options
    }
    return undefined
}

export const getDeviceNeedsPopularStringOptions = (attribute) => {
    const obj = getDeviceSchema().find(device => attribute === device.attribute)
    if (obj) {
        return obj.popularStringOption
    }
    return undefined
}
