'use strict';

var _ = require('lodash');
var assert = require('chai').assert;
var parserFactory = require('../../src/parse/token/invalid');

// Any token will be invalid
var acceptedSyntax = [
  ' K10',
  'K/10',
  'test'
];

describe('Invalid parser', function() {

  it('Should create parser', function(done) {
    var parse = parserFactory();
    assert.isFunction(parse);
    done();
  });

  it('Should parse', function(done) {
    var parse = parserFactory({
      allowInvalidTokens: true
    });
    _.each(acceptedSyntax, function(sample) {
      var token = parse(sample);
      assert.isObject(token);
      assert.equal(token.value, sample.charAt(0));
    });
    done();
  });

  it('Should respect offset', function(done) {
    var parse = parserFactory({
      allowInvalidTokens: true
    });
    var token = parse('R#f00; (K#fa0;) Y#ff0;', 7);
    assert.isObject(token);
    assert.equal(token.value, '(');
    done();
  });

});
