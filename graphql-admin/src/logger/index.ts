import * as pino from 'pino'
import * as httpContext from '../middleware/http-context'
/* tslint:disable no-any */

const loggingLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info'

function transactionData() {
    const data: any = {
        transId: httpContext.get('transId')
    }
    const user = httpContext.get('user')
    if (user) {
        data.user = {
            email: user.email,
            googleId: user.firebase.identities['google.com'][0]
        }
    }
    return data
}

function formatLog(logArgs: any) {
    if (typeof logArgs[0] === 'object') {
        return {
            objects: { ...logArgs[0], ...transactionData() },
            message: logArgs.slice(1)
        }
    }
    return {
        objects: transactionData(),
        message: logArgs
    }
}

const log = pino({
    name: 'GraphQL-Admin',
    level: loggingLevel
})

export interface Logger {
    info(...args: any[]): void
    debug(...args: any[]): void
    error(...args: any[]): void
}

const logger = {
    /**
     * Log at `'info'` level the given msg.
     * If the first argument is an object, all its properties will be included in the JSON log.
     * If more args follow the `msg`, these will be used to format `msg` using `util.format`.
     *
     * @param ...args: (msg: string, ...args: any[]) || (obj: object, msg?: string, ...args: any[])
     */
    info: function(...args: any[]) {
        const logMessage = formatLog(args)
        log.info(logMessage.objects, ...logMessage.message)
    },

    /**
     * Log at `'info'` level the given msg.
     * If the first argument is an object, all its properties will be included in the JSON log.
     * If more args follow the `msg`, these will be used to format `msg` using `util.format`.
     *
     * @param ...args: (msg: string, ...args: any[]) || (obj: object, msg?: string, ...args: any[])
     */
    debug: function(...args: any[]) {
        const logMessage = formatLog(args)
        log.debug(logMessage.objects, ...logMessage.message)
    },

    /**
     * Log at `'error'` level the given msg.
     * If the first argument is an object, all its properties will be included in the JSON log.
     * If more args follow the `msg`, these will be used to format `msg` using `util.format`.
     *
     * @param ...args: (msg: string, ...args: any[]) || (obj: object, msg?: string, ...args: any[])
     */
    error: function(...args: any[]) {
        const logMessage = formatLog(args)
        log.error(logMessage.objects, ...logMessage.message)
    }
}

export default logger
