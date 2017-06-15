const parse = require('../index')
const assert = require('assert')
const path = require('path')
const fs = require('fs')

const testfile = path.join(__dirname, "test.txt")
const testfileContents = "abc"

fs.writeFileSync(testfile, testfileContents)

describe('parse', function() {
    
    after(function() {
        fs.unlinkSync(testfile)
    })


    it('throws a type error when the protocol is not postgres', function() {
        try {
            parse("")
            throw new Error("TypeError was not thrown")
        } catch (e) {
            assert.equal(e instanceof TypeError, true)
        }
    })

    it('parses the host name', function() {
        let dsn = "postgres://postgres@localhost/"
        let conn = parse(dsn)

        assert.equal(conn.host, "localhost")
    })

    it('parses the host name and removes the port', function() {
        let dsn = "postgres://postgres@localhost:123123/"
        let conn = parse(dsn)

        assert.equal(conn.host, "localhost")
    })

    it('parses the port', function() {
        let dsn = "postgres://postgres@localhost:123/"
        let conn = parse(dsn)

        assert.equal(conn.port, 123)
    })

    it('parses the dbname', function() {
        let dsn = "postgres://postgres@localhost:123/hello123"
        let conn = parse(dsn)

        assert.equal(conn.database, 'hello123')
    })

    it('parses authentication', function() {
        let dsn = "postgres://username:password@localhost:123/"
        let conn = parse(dsn)

        assert.equal(conn.user, "username")
        assert.equal(conn.password, "password")
    })

    describe('ssl', function() {

        it('returns false when sslmode is set to disable', function() {
            let dsn = "postgres://postgres@localhost:123/?sslmode=disable"
            let conn = parse(dsn)

            assert.equal(conn.ssl, false)
        })

        it('returns true when ssl is enabled but no other options are passed', function() {
            let dsn = "postgres://postgres@localhost:123/?sslmode=verify-ca"
            let conn = parse(dsn)
            
            assert.equal(conn.ssl, true)
        })

        it('parses sslcert', function() {
            let dsn = `postgres://postgres@localhost:123/?sslmode=verify-ca&sslcert=${testfile}`
            let conn = parse(dsn)
            
            assert.equal(typeof conn.ssl, 'object')

            let certContents = conn.ssl.cert.toString()
            
            assert.equal(certContents, testfileContents)
        })

        it('parses sslrootcert', function() {
            let dsn = `postgres://postgres@localhost:123/?sslmode=verify-ca&sslrootcert=${testfile}`
            let conn = parse(dsn)
            
            assert.equal(typeof conn.ssl, 'object')

            let certContents = conn.ssl.ca.toString()
            
            assert.equal(certContents, testfileContents)
        })

        it('parses sslkey', function() {
            let dsn = `postgres://postgres@localhost:123/?sslmode=verify-ca&sslkey=${testfile}`
            let conn = parse(dsn)
            
            assert.equal(typeof conn.ssl, 'object')

            let keyContents = conn.ssl.key.toString()
            
            assert.equal(keyContents, testfileContents)
        })

        it('parses sslcert, sslrootcert, sslkey', function() {
            let dsn = `postgres://postgres@localhost:123/?sslmode=verify-ca&sslkey=${testfile}&sslcert=${testfile}&sslrootcert=${testfile}`
            let conn = parse(dsn)
            
            assert.equal(typeof conn.ssl, 'object')

            let rootCertContents = conn.ssl.ca.toString()
            let certContents = conn.ssl.cert.toString()
            let keyContents = conn.ssl.key.toString()
            
            assert.equal(rootCertContents, testfileContents)
            assert.equal(certContents, testfileContents)
            assert.equal(keyContents, testfileContents)
            
        });
    })
})