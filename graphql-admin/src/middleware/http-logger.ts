import { NextFunction, Request, Response } from 'express'
import { Logger } from './../logger/index'
/* tslint:disable no-any */

export const HTTPLoggerMiddleware = function(logger: Logger) {
    return function(req: Request, res: Response, next: NextFunction) {
        const start = Date.now()

        const oldWrite = res.write
        const responseBody: any = []
        res.write = function(chunk: any) {
            responseBody.push(chunk)
            return oldWrite.apply(res, arguments)
        }

        res.on('finish', function() {
            let prettyResponse
            try {
                prettyResponse = JSON.parse(responseBody.join())
            } catch (e) {
                prettyResponse = responseBody.join()
            }
            const end = Date.now()
            logger.info({
                http: {
                    req: req.body,
                    res: prettyResponse,
                    code: res.statusCode,
                    duration: `${end - start}ms`
                }
            })
        })
        next()
    }
}
