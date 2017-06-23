var expect = require('Chai').expect
var request = require('request')
var Healthcheck = require('../index')


describe('configuration', function() {
    
    it('defaults to port 8080', function(done) {
        var server = new Healthcheck()
        server.start()

        request.get('http://localhost:8080', function (err, res){
            expect(res).to.not.be.undefined;
            done();
        });
    });


    it('uses the correct port', function(done) {
        var server = new Healthcheck(8081)
        server.start()

        request.get('http://localhost:8081', function (err, res){
            expect(res).to.not.be.undefined;
            done();
        });
    });


})

describe('readiness', function() {

    var server
    var port = 9009
    var testUrl = 'http://localhost:' + port + '/readiness'

    before(function() {
        server = new Healthcheck(port)
        server.start()
    });

    beforeEach(function() {
        server._clearConditionals()
    })

    after(function() {
        server.close();
    })

    it('should return 404 when readiness fails', function(done) {
        
        server.on('readiness', function() {
            return false
        })

        request.get(testUrl, function (err, res, body){
            expect(res.statusCode).to.equal(404);
            done();
        });
    });


    it('should return 200 when readiness passes', function(done) {
        
        server.on('readiness', function() {
            return true
        })

        request.get(testUrl, function (err, res, body){
            expect(res.statusCode).to.equal(200);
            done();
        });
    });


    it('should return 404 when at least one readiness fails', function(done) {
        
        server.on('readiness', function() {
            return true
        })

        server.on('readiness', function() {
            return false
        })

        server.on('readiness', function() {
            return true
        })

        request.get(testUrl, function (err, res, body){
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

});



describe('liveliness', function() {

    var server
    var port = 9008
    var testUrl = 'http://localhost:' + port + '/liveliness'

    before(function() {
        server = new Healthcheck(9008)
        server.start()
    });

    beforeEach(function() {
        server._clearConditionals()
    })

    after(function() {
        server.close();
    })

    it('should return 404 when liveliness fails', function(done) {
        
        server.on('liveliness', function() {
            return false
        })

        request.get(testUrl, function (err, res, body){
            expect(res.statusCode).to.equal(404);
            done();
        });
    });


    it('should return 200 when liveliness passes', function(done) {
        
        server.on('liveliness', function() {
            return true
        })

        request.get(testUrl, function (err, res, body){
            expect(res.statusCode).to.equal(200);
            done();
        });
    });


    it('should return 404 when at least one liveliness fails', function(done) {
        
        server.on('liveliness', function() {
            return true
        })

        server.on('liveliness', function() {
            return false
        })

        server.on('liveliness', function() {
            return true
        })

        request.get(testUrl, function (err, res, body){
            expect(res.statusCode).to.equal(404);
            done();
        });
    });

});