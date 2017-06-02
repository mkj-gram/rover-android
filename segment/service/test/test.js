var rewire = require("rewire")
var sshandler = rewire('../handlers/v1/static-segment-handler')
var expect = require('expect.js')

describe('parseOrderQuery', function() {
    var parseOrderQuery = sshandler.__get__('parseOrderQuery')

    it('should use ASC order by default', function() {
        var result = parseOrderQuery("created_at")
        expect(result).to.be.an('array')
        expect(result).to.eql([{ column: "created_at", order: "ASC" }])
    });

    it('should parse multiple columns', function() {
        var result = parseOrderQuery("created_at,updated_at")
        expect(result).to.be.an('array')
        expect(result).to.eql([{ column: "created_at", order: "ASC" }, { column: "updated_at", order: "ASC" }])
    });

    it('should disregard sort order that isnt ASC, or DESC', function() {
        var result = parseOrderQuery("created_at NOPE")
        expect(result).to.be.an('array')
        expect(result).to.eql([{ column: "created_at", order: "ASC" }])
    });

    it('should always return an array', function() {
        var result = parseOrderQuery("")
        expect(result).to.be.an('array')
        expect(result).to.eql([])
    });

})


describe('getAllStaticSegments', function() {
    var getAllStaticSegments = sshandler.__get__('getAllStaticSegments')    
});