import platform from 'platform'
import moment from 'moment'
import 'moment-timezone'
import 'whatwg-fetch'

export const sendData = data =>
    fetch('https://api.staging.rover.io/v1/events', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-ROVER-API-KEY': 'f7979c3a98fff4ade7cf2c68553e267c'
            },
            body: JSON.stringify(getBody(data))
        })

const getBody = (data = {}) => ({
    data: {
        type: 'events',
        attributes: {
            timestamp: new Date().toISOString(),
            attributes: data,
            device: {
                'locale-lang': navigator.language.slice(0, 2),
                'locale-region': navigator.language.slice(-2),
                'time-zone': moment.tz.guess(),
                'sdk-version': VERSION,
                platform: 'Web',
                'os-name': platform.os.family,
                'os-version': platform.os.version,
                model: platform.product,
                manufacturer: platform.manufacturer
            }
        }
    }
})
