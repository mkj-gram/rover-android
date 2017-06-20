import platform from 'platform'
import moment from 'moment'
import 'moment-timezone'
import 'whatwg-fetch'
import queue from 'async/queue'

const eventQueue = queue(
    ({ name, data, analyticsToken, analyticsURL }, callback) => {
        fetch(analyticsURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-ROVER-API-KEY': analyticsToken,
                'X-ROVER-DEVICE-ID': localStorage.getItem('rover-device-id')
            },
            body: JSON.stringify(getBody(name, data))
        })
        .then(() => callback())
        .catch(err => {
            console.error(err)
            return callback()
        })
    },
    1
)

export const sendData = (name, data, analyticsToken, analyticsURL) =>
    eventQueue.push({
        name: name,
        data: data,
        analyticsToken: analyticsToken,
        analyticsURL: analyticsURL
    })

const getBody = (name = '', data = {}) => ({
    data: {
        type: 'events',
        attributes: {
            timestamp: new Date().toISOString(),
            name: name,
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
