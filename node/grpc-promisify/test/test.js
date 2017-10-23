const assert = require('sinon').assert
const expect = require('chai').expect
const sinon = require('sinon')
const promisify = require('../index.js')

describe('retryify', function() {
        
    function makeClient() {
        function Client() {}
        Client.prototype.test = function(...args) {
            let req = args[0]
            let cb = args[args.length - 1]
            return cb(null, req) 
        }
        return new Client()
    }

    it('returns a promise when no callback is passed', function(done) {
        let client = makeClient()
        promisify(client)

        let res = client.test("hello")
        expect(Promise.resolve(res)).to.eq(res)
        done()
    })

    it('preserves callback style when a callback is passed', function(done) {
        let client = makeClient()
        promisify(client)

        client.test("hello", function(err, response) {
            expect(err).to.be.null
            expect(response).to.equal("hello")
            done()
        })
    })

    it('preserves calling options', function(done) {
        let client = makeClient()
        let spy = sinon.spy(client, "test")
        promisify(client)


        let res = client.test("hello", { deadline: "now" })

        
        res.then(_ => {
                let args = spy.getCall(0).args
                expect(args[0]).to.equal("hello")
                expect(args[1]).to.deep.equal({ deadline: "now" })
                done()
            })
            .catch(e => {
                return done(e)
            })
    })
    
})