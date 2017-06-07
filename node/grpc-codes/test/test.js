var assert = require('assert');
var { grpcToHttp, httpToGrpc } = require('../index')

describe('grpcToHttp', function() {

    it('maps valid grpc code to http code', function() {
        assert.equal(grpcToHttp(5), 404)
    })

    it('accepts strings', function() {
        assert.equal(grpcToHttp("5"), 404)
    })

    it('accepts integers', function() {
        assert.equal(grpcToHttp(5), 404)
    })

    it('it defaults to http code 500 if no mapping exists', function() {
        assert.equal(grpcToHttp(1), 500)
    })

})



describe('httpToGrpc', function() {
    
    it('maps valid http code to grpc code', function() {
        assert.equal(httpToGrpc(404), 5)
    })

    it('accepts strings', function() {
        assert.equal(httpToGrpc("404"), 5)
    })

    it('accepts integers', function() {
        assert.equal(httpToGrpc(500), 15)
    })

    it('defaults to unknown code if no mapping exists', function() {
        assert.equal(httpToGrpc(333), 0)
    })

})