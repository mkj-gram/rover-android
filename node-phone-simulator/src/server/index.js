'use strict'

import dotenv from 'dotenv'
import express from 'express'
import lruCache from 'lru-cache'
import crypto from 'crypto'
import compression from 'compression'
import CachedRequest from './lib/cached-request'
import morgan from 'morgan'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from '../app'

import RoverApis from '@rover/apis'
import Auth from '@rover/auth-client'

dotenv.config()

if (process.env.NEW_RELIC_ENABLED === 'true') {
    require('newrelic')
}

const AuthClient = Auth.v1.Client()

const app = express()

const renderCache = lruCache({ max: 500, maxAge: 60 * 1000 })

app.use(morgan('tiny'))

app.use(express.static('public'))
app.use(compression())

app.set('port', process.env.PORT || 80)

app.set('views', 'views')
app.set('view engine', 'pug')

app.get('/.well-known/assetlinks.json', (req, res) => {
    const host = req.headers.host

    fetchAppProfile(host)
        .then(response => {
            if (!response) {
                return Promise.reject({ statusCode: 404 })
            }

            const { android = {} } = response
            const { packageName, sha256CertFingerprints } = android

            if (!packageName || !sha256CertFingerprints) {
                return Promise.reject({ statusCode: 404 })
            }

            res.setHeader('Content-Type', 'application/json')
            res.send(
                JSON.stringify([
                    {
                        relation: [
                            'delegate_permission/common.handle_all_urls'
                        ],
                        target: {
                            namespace: 'android_app',
                            package_name: packageName,
                            sha256_cert_fingerprints: sha256CertFingerprints
                        }
                    }
                ])
            )
        })
        .catch(respondWithError(res))
})

app.get('/.well-known/apple-app-site-association', (req, res) => {
    const host = req.headers.host

    fetchAppProfile(host)
        .then(response => {
            if (!response) {
                return Promise.reject({ statusCode: 404 })
            }

            const { ios = {} } = response
            const { appIdPrefix, bundleIdentifier } = ios

            if (!appIdPrefix || !bundleIdentifier) {
                return Promise.reject({ statusCode: 404 })
            }

            res.setHeader('Content-Type', 'application/json')
            res.send(
                JSON.stringify({
                    applinks: {
                        apps: [],
                        details: [
                            {
                                appID: appIdPrefix + '.' + bundleIdentifier,
                                paths: ['*']
                            }
                        ]
                    }
                })
            )
        })
        .catch(respondWithError(res))
})

app.get('/:shortUrl', (req, res, next) => {
    const host = req.headers.host

    let iosAppProfile = null
    let androidAppProfile = null
    let experience = null
    let analyticsToken = null
    const userAgent = req.headers['user-agent']
    const isMobile = /Mobile/.test(userAgent)
    const isAndroid =
        /Android/.test(userAgent) || req.query.platform === 'Android'

    const shortUrl = req.params.shortUrl

    const showStatusBar = req.query.showStatusBar === 'true'
    const showCloseButton = req.query.showCloseButton === 'true'
    const version = req.query.version
    const token = req.query.viewToken

    fetchAppProfile(host)
        .then(response => {
            if (!response) {
                return Promise.reject({ statusCode: 404 })
            }

            iosAppProfile = response.ios || {}
            androidAppProfile = response.android || {}
            return fetchExperienceByShortUrl(shortUrl, version, token)
        })
        .then(response => {
            if (!response) {
                return Promise.reject({ statusCode: 404 })
            }

            const experienceId = Object.keys(response.experiences)[0]
            experience = response.experiences[experienceId]
        })
        .then(() => getAnalyticsToken(experience.accountId))
        .then(token => {
            analyticsToken = token
        })
        .then(() => {
            renderExperienceHtml(experience, !version, {
                analyticsToken: analyticsToken,
                isMobile: isMobile,
                isAndroid: isAndroid,
                showStatusBar: showStatusBar,
                showCloseButton: showCloseButton,
                host: host,
                shortUrl: req.params.shortUrl,
                appIdPrefix: iosAppProfile.appIdPrefix,
                bundleIdentifier: iosAppProfile.bundleIdentifier,
                appStoreId: iosAppProfile.appStoreId,
                pageTitle: experience.name,
                imageUrl: getImageUrl(experience),
                description: getTextDescription(experience),
                simulatorUrl: experience.simulatorUrl
            })
            .then(html => {
                res.setHeader('Content-Type', 'text/html; charset=utf-8')
                res.send(html)
            })
            .catch(respondWithError(res))
        })
        .catch(respondWithError(res))
})

app.get('*', (req, res) => {
    res.status(404).render('notFound')
})

app.use((err, req, res, next) => {
    console.log(err)

    if (res.headersSent) {
        return next(err)
    }
    res.status(500).render('error', { error: err })
})

app.listen(app.get('port'), function() {
    console.log('Simulator running on port', app.get('port'))
})

const apiRequest = new CachedRequest({
    baseUrl: process.env.BASE_URL || 'https://api.rover.io/v1/'
})

const fetchAppProfile = appProfileId => {
    return new Promise((resolve, reject) => {
        let options = {
            json: true,
            uri: '/app-profiles?host=' + appProfileId
        }

        apiRequest.get(options, (error, response, body) => {
            if (error) {
                return reject(error)
            }

            if (!body) {
                return resolve(null)
            }

            const { data } = body

            if (!data) {
                return resolve(null)
            }

            const { type, attributes = {} } = data

            if (type !== 'app-profiles') {
                return resolve(null)
            }

            const { ios = {}, android = {} } = attributes

            return resolve({
                ios: {
                    appIdPrefix: ios['app-id-prefix'],
                    bundleIdentifier: ios['bundle-id'],
                    appStoreId: ios['app-store-id']
                },
                android: {
                    packageName: android['package-name'],
                    sha256CertFingerprints: android['sha256-cert-fingerprints']
                }
            })
        })
    })
}

const renderExperienceHtml = (experience, useRenderCache, options) => {
    let {
        analyticsToken,
        isMobile,
        isAndroid,
        showStatusBar,
        showCloseButton,
        host,
        shortUrl,
        appIdPrefix,
        bundleIdentifier,
        appStoreId,
        pageTitle,
        imageUrl,
        description,
        simulatorUrl
    } = options

    function render() {
        const analyticsURL = process.env.ANALYTICS_URL || `https://api.rover.io/v1/events`
        return new Promise((resolve, reject) => {
            const reactApp = ReactDOMServer.renderToString(
                <App
                    experience={experience}
                    analyticsToken={analyticsToken}
                    analyticsURL={analyticsURL}
                    isMobile={isMobile}
                    isAndroid={isAndroid}
                    showStatusBar={showStatusBar}
                    showCloseButton={showCloseButton}
                />
            )
            
            const props = {
                experience: experience,
                analyticsToken: analyticsToken,
                analyticsURL: analyticsURL,
                showStatusBar: showStatusBar,
                showCloseButton: showCloseButton,
                isAndroid: isAndroid,
                isMobile: isMobile
            }

            app.render(
                'experience',
                {
                    host: host,
                    shortUrl: shortUrl,
                    appIdPrefix: appIdPrefix,
                    bundleIdentifier: bundleIdentifier,
                    appStoreId: appStoreId,
                    pageTitle: pageTitle,
                    imageUrl: imageUrl,
                    description: description,
                    simulatorUrl: simulatorUrl,
                    app: reactApp,
                    props: 'var PROPS = ' + JSON.stringify(props)
                },
                (err, html) => {
                    if (err) {
                        return reject({ statusCode: 500, error: err })
                    }

                    return resolve(html)
                }
            )
        })
    }

    if (useRenderCache) {
        const hash = crypto.createHash('sha256')

        const cacheKeyBuilder =
            experience.id +
            isMobile +
            isAndroid +
            showStatusBar +
            showCloseButton +
            host +
            shortUrl +
            appIdPrefix +
            bundleIdentifier +
            appStoreId +
            pageTitle +
            imageUrl +
            description +
            simulatorUrl

        hash.update(cacheKeyBuilder)

        const cacheKey = hash.digest('hex')

        const preRenderedHtml = renderCache.get(cacheKey)

        if (preRenderedHtml) {
            return Promise.resolve(preRenderedHtml)
        } else {
            return render().then(html => {
                renderCache.set(cacheKey, html, 60 * 1000)
                return Promise.resolve(html)
            })
        }
    } else {
        return render()
    }
}

// TODO: Replace this with the implementation in @rover/common

const fetchExperienceByShortUrl = (shortUrl, version, token) => {
    return new Promise((resolve, reject) => {
        let options = {
            json: true,
            uri: '/experiences/' + shortUrl
        }

        if (version && token) {
            options.uri = `/experiences/${shortUrl}?version=${version}&viewToken=${token}`
        }

        apiRequest.get(options, (error, response, body) => {
            if (error) {
                return reject(error)
            }

            if (!body) {
                return resolve(null)
            }

            const { data } = body

            if (!data) {
                return resolve(null)
            }

            const { id, type, attributes = {} } = data

            if (!id) {
                return resolve(null)
            }

            if (type !== 'experiences') {
                return resolve(null)
            }

            resolve({
                experiences: {
                    [id]: {
                        accountId: attributes['account-id'],
                        hasUnpublishedChanges: attributes[
                            'has-unpublished-changes'
                        ],
                        homeScreenId: attributes['home-screen-id'],
                        id: id,
                        isArchived: attributes['is-archived'],
                        isPublished: attributes['is-published'],
                        name: attributes['name'],
                        ...attributes['screens'].reduce(normalizeScreen, {}),
                        shortUrl: attributes['short-url'],
                        simulatorUrl: attributes['simulator-url'],
                        versionId: attributes['version-id']
                    }
                }
            })
        })
    })
}

const getAnalyticsToken = accountId => {
    return new Promise((resolve, reject) => {
        
        const request = new RoverApis.auth.v1.Models.ListTokensRequest()
        request.setAccountId(accountId)
        
        AuthClient.listTokens(request, (err, response) => {
            if (err) {
                reject({ statuscode: 500 })
            }
            
            const tokens = response.getTokensList()
            
            const webToken = tokens.find(token => token.getPermissionScopesList().includes('web'))
            
            if (webToken) {
                return resolve(webToken.getKey())
            }
            
            return reject({ statuscode: 500 })
        })
    })
}

const normalizeScreen = (map, response) => {
    map.screens = map.screens || {}
    const backgroundImage = response['background-image']

    map.screens[response.id] = {
        backgroundColor: response['background-color'],
        backgroundImage: backgroundImage
            ? {
                  height: backgroundImage['height'],
                  width: backgroundImage['width'],
                  type: backgroundImage['type'],
                  name: backgroundImage['name'],
                  size: backgroundImage['size'],
                  url: backgroundImage['url']
              }
            : null,
        backgroundContentMode: response['background-content-mode'],
        backgroundScale: response['background-scale'],
        experienceId: response['experience-id'],
        id: response['id'],
        name: response['name'],
        ...response['rows'].reduce(normalizeRow, {}),
        statusBarStyle: response['status-bar-style'],
        statusBarColor: response['status-bar-color'],
        autoColorStatusBar: response['status-bar-auto-color'],
        titleBarBackgroundColor: response['title-bar-background-color'],
        titleBarButtons: response['title-bar-buttons'],
        titleBarButtonColor: response['title-bar-button-color'],
        titleBarText: response['title'],
        titleBarTextColor: response['title-bar-text-color'],
        useDefaultTitleBarStyle: response['use-default-title-bar-style'],
        hasUnpublishedChanges: response['has-unpublished-changes']
    }

    return map
}

const normalizeRow = (map, response) => {
    map.rows = map.rows || {}

    const id = response['id']
    const backgroundImage = response['background-image']

    map.rows[id] = {
        autoHeight: response['auto-height'],
        backgroundColor: response['background-color'],
        backgroundImage: backgroundImage
            ? {
                  height: backgroundImage['height'],
                  width: backgroundImage['width'],
                  type: backgroundImage['type'],
                  name: backgroundImage['name'],
                  size: backgroundImage['size'],
                  url: backgroundImage['url']
              }
            : null,
        backgroundContentMode: response['background-content-mode'],
        backgroundScale: response['background-scale'],
        ...response['blocks'].reduce(normalizeBlock, {}),
        experienceId: response['experience-id'],
        height: response['height'].value,
        id: id,
        isCollapsed: response['is-collapsed'],
        name: response['name'],
        screenId: response['screen-id']
    }

    return map
}

const normalizeBlock = (map, response) => {
    map.blocks = map.blocks || {}

    const action = response['action']
    const alignment = response['alignment']
    const backgroundImage = response['background-image']
    const id = response['id']
    const image = response['image']
    const inset = response['inset']
    const offset = response['offset']
    const textFont = response['text-font']
    const text = response['text']
        ? response['text'].replace('<p></p>', '<p><br></p>')
        : undefined
    const type = response['type']

    map.blocks[id] = {
        action: action
            ? {
                  type: action['type'],
                  screenId: action['screen-id'],
                  url: action['url']
              }
            : undefined,
        autoHeight: response['auto-height'],
        backgroundColor: response['background-color'],
        backgroundContentMode: response['background-content-mode'],
        backgroundImage: backgroundImage
            ? {
                  height: backgroundImage['height'],
                  width: backgroundImage['width'],
                  type: backgroundImage['type'],
                  name: backgroundImage['name'],
                  size: backgroundImage['size'],
                  url: backgroundImage['url']
              }
            : undefined,
        backgroundScale: response['background-scale'],
        barcodeType: response['barcode-type'],
        barcodeText: response['barcode-text'],
        barcodeScale: response['barcode-scale'],
        borderColor: response['border-color'],
        borderRadius: response['border-radius'],
        borderWidth: response['border-width'],
        bottom: offset['bottom']['value'],
        center: offset['center']['value'],
        color: response['text-color'],
        editorState: undefined,
        experienceId: response['experience-id'],
        fontSize: textFont ? textFont['size'] : undefined,
        fontWeight: textFont ? textFont['weight'] : undefined,
        height: response['height']['value'],
        horizontalAlign: alignment['horizontal'],
        id,
        image: image
            ? {
                  height: image['height'],
                  width: image['width'],
                  type: image['type'],
                  name: image['name'],
                  size: image['size'],
                  url: image['url']
              }
            : undefined,
        insets: [inset['top'], inset['right'], inset['bottom'], inset['left']],
        left: offset['left']['value'],
        lockStatus: response['lock-status'],
        middle: offset['middle']['value'],
        name: response['name'],
        opacity: response['opacity'] || 1.0,
        position: response['position'],
        right: offset['right']['value'],
        rowId: response['row-id'],
        screenId: response['screen-id'],
        scrollable: response['scrollable'],
        text: text,
        textAlign: response['text-alignment'],
        top: offset['top']['value'],
        type,
        url: response['url'],
        verticalAlign: alignment['vertical'],
        width: response['width']['value']
    }

    if (!response['states']) {
        return map
    }

    const state = response['states']['normal']
    if (!state) {
        return map
    }

    map.blocks[id] = {
        ...map.blocks[id],
        backgroundColor: state['background-color'],
        borderColor: state['border-color'],
        borderRadius: state['border-radius'],
        borderWidth: state['border-width'],
        text: state['text'],
        textAlign: state['text-alignment'],
        color: state['text-color'],
        fontSize: state['text-font']['size'],
        fontWeight: state['text-font']['weight']
    }

    return map
}

const respondWithError = res => {
    return error => {
        console.log(error)

        if (error && error.statusCode && error.statusCode === 404) {
            res.status(404).render('notFound')
            return
        }

        res.status(500).render('error', { error: error })
    }
}

const getImageUrl = experience => {
    for (const screen in experience.screens) {
        for (const row in experience.screens[screen].rows) {
            for (const block in experience.screens[screen].rows[row].blocks) {
                if (experience.screens[screen].rows[row].blocks[block].image) {
                    return experience.screens[screen].rows[row].blocks[block]
                        .image.url
                }
            }
        }
    }
}

const getTextDescription = experience => {
    for (const screen in experience.screens) {
        for (const row in experience.screens[screen].rows) {
            for (const block in experience.screens[screen].rows[row].blocks) {
                if (experience.screens[screen].rows[row].blocks[block].text) {
                    const regex = /(&nbsp;|<([^>]+)>)/gi
                    const text =
                        experience.screens[screen].rows[row].blocks[block].text
                    return text.replace(regex, '')
                }
            }
        }
    }
}
