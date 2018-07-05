import { NextFunction, Request, Response } from 'express'
import * as admin from 'firebase-admin'
import * as httpContext from './http-context'

export const OAuthMiddleware = function(
    projectId: string,
    clientEmail: string,
    privateKey: string,
    databaseURL: string
) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: projectId,
            clientEmail: clientEmail,
            privateKey: privateKey
        }),
        databaseURL: databaseURL
    })

    return function(req: Request, res: Response, next: NextFunction) {
        const headers = req.headers

        if (!headers.hasOwnProperty('authorization')) {
            return res.status(401).send('Unauthorized request')
        }
        const idToken = headers.authorization.split(' ')[1]

        async function verifyIdentity() {
            const decodedToken = await admin.auth().verifyIdToken(idToken)

            if (decodedToken === undefined) {
                throw new Error('Auth error')
            }
            const email = decodedToken.email
            const verified = decodedToken.email_verified
            if (!email.endsWith('@rover.io') || !verified) {
                httpContext.set('user', decodedToken)
                throw new Error('User must be using a verified rover.io email')
            }
            return decodedToken
        }

        verifyIdentity()
            .then(payload => {
                httpContext.set('user', payload)
                next()
            })
            .catch(err => res.status(401).send(err.message))
    }
}
