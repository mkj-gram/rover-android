import { OAuth2Client } from 'google-auth-library'
import { Response, Request, NextFunction } from 'express'
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket'

interface AdminRequest extends Request {
    oAuth: TokenPayload
}

const OAuthMiddleware = function(clientID: string, clientSecret: string) {
    return function(req: AdminRequest, res: Response, next: NextFunction) {
        const headers = req.headers

        if (!headers.hasOwnProperty('authorization')) {
            return res.status(401).send('Unauthorized request')
        }
        const idToken = headers['authorization'].split(' ')[1]
        const client = new OAuth2Client(clientID, clientSecret)

        async function verifyIdentity() {
            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: clientID
            })
            const payload = ticket.getPayload()

            if (payload === undefined) {
                throw new Error('Auth error')
            }
            const domain = payload['hd']
            const verified = payload['email_verified']
            if (domain !== 'rover.io' || !verified) {
                throw new Error('User must be using a verified rover.io email')
            }
            return payload
        }

        verifyIdentity()
            .then(payload => {
                req.oAuth = payload
                next()
            })
            .catch(err => res.status(401).send(err.message))
    }
}

export { OAuthMiddleware }
