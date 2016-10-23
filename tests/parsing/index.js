'use strict';

var assert = require('chai').assert;
var tartan = require('../../src');

describe('Parser', function() {

  describe('Simplest parser', function() {

    it('Should create parser', function(done) {
      var parse = tartan.parse();
      assert.isFunction(parse);
      done();
    });

    it('Should throw an exception', function(done) {
      var parse = tartan.parse();
      assert.throws(function() {
        parse('R10 K10');
      }, Error);
      done();
    });

    it('Should throw parse invalid tokens', function(done) {
      var parse = tartan.parse([], {
        allowInvalidTokens: true
      });
      var sett = parse('R10 K10');

      assert.isObject(sett);
      assert.equal(sett.warp.length, 3); // invalid, whitespace, invalid

      done();
    });

  });

});
