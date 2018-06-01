import fs from 'fs'
import path from 'path'
import url from 'url'

const fragments = [
    'experienceFields',
    'notificationFields',
    'regionFields'
]

const fragmentMap = fragments.reduce((result, fragment) => {
    const fileName = path.resolve(__dirname, `${fragment}.graphql`)
    result[fragment] = fs.readFileSync(fileName, 'utf8')
    return result
}, {})

export default (req, res, next) => {    
    const parsedURL = url.parse(req.url, true)
    if (typeof parsedURL.query.fragments !== 'string') {
        next()
        return
    }
 
    const fragments = JSON.parse(parsedURL.query.fragments)
    if (Array.isArray(fragments) && typeof parsedURL.query.query === 'string') {
        parsedURL.query.query = fragments.reduce((result, fragment) => {
            if (typeof fragmentMap[fragment] !== 'string') {
                return result
            }

            return result + fragmentMap[fragment]
        }, parsedURL.query.query)
    }

    delete parsedURL.query.fragments
    delete parsedURL.search
    req.url = url.format(parsedURL)
    next() 
}
