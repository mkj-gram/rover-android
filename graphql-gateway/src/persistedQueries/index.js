import fs from 'fs'
import path from 'path'
import url from 'url'

const experienceFragments = [
    'fragments/backgroundFields.graphql',
    'fragments/colorFields.graphql',
    'fragments/experienceFields.graphql',
    'fragments/heightFields.graphql',
    'fragments/imageFields.graphql',
    'fragments/textFields.graphql'
]

const makeQuery = fileNames => fileNames
    .map(fileName => path.resolve(__dirname, fileName))
    .map(fileName => fs.readFileSync(fileName, 'utf8'))
    .join('\n')

const queryMap = {
    1: makeQuery([
        'FetchExperienceByCampaignID.graphql',
        ...experienceFragments
    ]),
    2: makeQuery([
        'FetchExperienceByCampaignURL.graphql',
        ...experienceFragments
    ]),
    3: makeQuery([
        'FetchExperienceByID.graphql',
        ...experienceFragments
    ])
}

export default (req, res, next) => {    
    const parsedURL = url.parse(req.url, true)
    if (parsedURL.query.id) {
        parsedURL.query.query = queryMap[req.query.id]
        delete parsedURL.query.id
        delete parsedURL.search
        req.url = url.format(parsedURL)
    }
    next() 
}
