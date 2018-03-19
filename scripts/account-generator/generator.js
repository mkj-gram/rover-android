const stream = require('stream')
const faker = require('faker')
const uuid = require('uuid')

function Generator(max, options) {
    options.objectMode = true

    stream.Readable.call(this, options);

    this._max = max
    this._current = 0
}

Generator.prototype = Object.create(stream.Readable.prototype);
Generator.prototype.constructor = stream.Readable;

const hardwares = [
    {
        device_manufacturer: "Apple",
        os_version: "11.1.0",
        device_model: "iPhone 7 Plus",
        device_model_raw: "iPhone 7,2",
        os_name: "iOS"
    },
    {
        device_manufacturer: "Apple",
        os_version: "10.3.1",
        device_model: "iPhone 6s",
        device_model_raw: "iPhone 6,1",
        os_name: "iOS"
    },
    {
        device_manufacturer: "Apple",
        os_version: "11.2.0",
        device_model: "iPhone 10",
        device_model_raw: "iPhone 8,2",
        os_name: "iOS"
    },
    {
        device_manufacturer: "Samsung",
        os_version: "5.1.1",
        device_model: "Galaxy S8",
        device_model_raw: "Galaxy S8",
        os_name: "Android"
    },
    {
        device_manufacturer: "Samsung",
        os_version: "5.0.1",
        device_model: "Galaxy S9 Note",
        device_model_raw: "Galaxy S9 Note",
        os_name: "Android"
    },
    {
        device_manufacturer: "LG",
        os_version: "6.3.1",
        device_model: "V30",
        device_model_raw: "V30",
        os_name: "Android"
    }
]

const screenDimensions = [
    {
        screen_width: 480,
        screen_height: 720 
    },
    {
        screen_width: 1125,
        screen_height:2436
    },
    {
        screen_width: 640,
        screen_height: 1136
    },
    {
        screen_width: 2048,
        screen_height: 2732
    },
    {
        screen_width: 1440,
        screen_height: 2560
    },
    {
        screen_width: 1080,
        screen_height: 1920
    },
    {
        screen_width: 1200,
        screen_height: 1920
    },
    {
        screen_width: 800,
        screen_height: 1280
    },
]

function sample(arr) {
    return arr[Math.floor(Math.random()*arr.length)]
}

function generateDevice(profileIdentifier) {
    let d = {
        device_id: uuid.v4().toUpperCase(),
        profile_identifier: profileIdentifier,
        push_token_key: (Math.random() * 100 > 30) ? uuid.v4().toUpperCase() : "",
        app_name: "Rover Demo",
        app_version: "1.5 Prod Release",
        app_build: "53",
        app_namespace: "io.Rover.Demo",
        locale_language: sample(['en', 'es', 'uk']),
        locale_region: sample(['ca', 'us', 'gb']),
        is_wifi_enabled: faker.random.boolean(),
        is_cellular_enabled: faker.random.boolean(),
        carrier_name: sample(['verison', 'at&t', 'virgin']),
        time_zone: sample(['America/New_York', 'America/Los_Angeles', 'America/Denver']),
        platform: 'MOBILE',
        is_background_enabled: faker.random.boolean(),
        is_location_monitoring_enabled: faker.random.boolean(),
        ip: faker.internet.ip()
    }

    Object.assign(d, sample(hardwares))
    Object.assign(d, sample(screenDimensions))

    return d
}

Generator.prototype._read = function() {
    const profileIdentifier = faker.internet.email()

    let ret = {
        profile: {
            identifier: profileIdentifier,
            attributes: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                seasonTicketHolder: (Math.random() * 100) > 40, // 60% of season ticket holder
                loyaltyBalance: Math.floor(Math.random() * 2500) + 1,
                attendingGame: (Math.random() * 100) > 40 ? new Date("2018-03-15T00:00:00.000Z") : null
            }
        },
        device: generateDevice(profileIdentifier)
    }

    this.push(ret)
    this._current = this._current + 1
    if (this._current >= this._max) {
        this.push(null)
    }
};

module.exports = Generator

