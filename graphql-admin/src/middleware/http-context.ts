import { createNamespace, getNamespace } from 'continuation-local-storage'
import { NextFunction, Request, Response } from 'express'
import { v1 } from 'uuid'

const NAMESPACE: string = 'admin request'

export function ContextMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const ns = getNamespace(NAMESPACE) || createNamespace(NAMESPACE)
    ns.run(function() {
        ns.set('transId', v1())
        next()
    })
}

/**
 * Gets a value from the current context by key.
 * Will return undefined if the context has not yet been initialized
 * for this request or if a value is not found for the specified key.
 * @param {string} key
 */
export function get(key: string) {
    const ns = getNamespace(NAMESPACE)
    if (ns && ns.active) {
        return ns.get(key)
    }
}

/**
 * Adds a value to the current context by key.
 * If the key already exists, its value will be overwritten.
 * @param {string} key
 * @param {any} value
 */
export function set(key: string, value: any) {
    const ns = getNamespace(NAMESPACE)
    if (ns && ns.active) {
        return ns.set(key, value)
    }
}
