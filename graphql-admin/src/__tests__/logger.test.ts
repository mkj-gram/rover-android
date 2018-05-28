import logger from '../logger'
import * as os from 'os'
import * as util from 'util'

const stdoutSpy = jest.spyOn(process.stdout, 'write')

const logString = 'just a message'
const object = { test: 'testobject' }
const replacementString = 'replacement %s'
const multipleReplacementString = 'replacement %s %s'
const replacement1 = 'test1'
const replacement2 = 'test2'

test('INFO only message input', () => {
    logger.info(logString)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                logString +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin","v":1}\n'
        )
    )
})

test('INFO message string replacement ', () => {
    logger.info(replacementString, replacement1)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(replacementString, replacement1) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin","v":1}\n'
        )
    )
})

test('INFO message multiple string replacement ', () => {
    logger.info(multipleReplacementString, replacement1, replacement2)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(
                    multipleReplacementString,
                    replacement1,
                    replacement2
                ) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin","v":1}\n'
        )
    )
})

test('INFO only object input', () => {
    logger.info(object)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})

test('INFO object and message input', () => {
    logger.info(object, logString)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                logString +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})

test('INFO object and replacement string input', () => {
    logger.info(object, replacementString, replacement1)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(replacementString, replacement1) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})

test('INFO object and multiple replacement string input', () => {
    logger.info(object, multipleReplacementString, replacement1, replacement2)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(
                    multipleReplacementString,
                    replacement1,
                    replacement2
                ) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})

test('DEBUG only message input', () => {
    logger.debug(logString)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                logString +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin","v":1}\n'
        )
    )
})

test('DEBUG message string replacement ', () => {
    logger.debug(replacementString, replacement1)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(replacementString, replacement1) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin","v":1}\n'
        )
    )
})

test('DEBUG message multiple string replacement ', () => {
    logger.debug(multipleReplacementString, replacement1, replacement2)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(
                    multipleReplacementString,
                    replacement1,
                    replacement2
                ) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin","v":1}\n'
        )
    )
})

test('DEBUG only object input', () => {
    logger.debug(object)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})

test('DEBUG object and message input', () => {
    logger.debug(object, logString)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                logString +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})

test('DEBUG object and replacement string input', () => {
    logger.debug(object, replacementString, replacement1)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(replacementString, replacement1) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})

test('DEBUG object and multiple replacement string input', () => {
    logger.debug(object, multipleReplacementString, replacement1, replacement2)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(
                    multipleReplacementString,
                    replacement1,
                    replacement2
                ) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})

test('ERROR only message input', () => {
    logger.error(logString)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                logString +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin","v":1}\n'
        )
    )
})

test('ERROR message string replacement ', () => {
    logger.error(replacementString, replacement1)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(replacementString, replacement1) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin","v":1}\n'
        )
    )
})

test('ERROR message multiple string replacement ', () => {
    logger.error(multipleReplacementString, replacement1, replacement2)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(
                    multipleReplacementString,
                    replacement1,
                    replacement2
                ) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin","v":1}\n'
        )
    )
})

test('ERROR only object input', () => {
    logger.error(object)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})

test('ERROR object and message input', () => {
    logger.error(object, logString)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                logString +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})

test('ERROR object and replacement string input', () => {
    logger.error(object, replacementString, replacement1)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(replacementString, replacement1) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})

test('ERROR object and multiple replacement string input', () => {
    logger.error(object, multipleReplacementString, replacement1, replacement2)

    expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining(
            ',"msg":"' +
                util.format(
                    multipleReplacementString,
                    replacement1,
                    replacement2
                ) +
                '","pid":' +
                process.pid +
                ',"hostname":"' +
                os.hostname() +
                '","name":"GraphQL-Admin",' +
                JSON.stringify(object).replace(/[{}]/g, '') +
                ',"v":1}\n'
        )
    )
})
