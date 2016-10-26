'use strict';

var _ = require('lodash');
var assert = require('chai').assert;
var parserFactory = require('../../src/parse/token/whitespace');

var acceptedSyntax = [
  '   ',
  '   K10'
];

var invalidSyntax = [
  '',
  'K10   ',
  'test'
];

describe('Whitespace parser', function() {

  it('Should create parser', function(done) {
    var parse = parserFactory();
    assert.isFunction(parse);
    done();
  });

  it('Should parse', function(done) {
    var parse = parserFactory();
    _.each(acceptedSyntax, function(sample) {
      var token = parse(sample);
      assert.isObject(token);
      assert.equal(token.value, '   ');
    });
    done();
  });

  it('Should not parse', function(done) {
    var parse = parserFactory();
    _.each(invalidSyntax, function(sample) {
      var token = parse(sample);
      assert.isNotObject(token);
    });
    done();
  });

  it('Should respect offset', function(done) {
    var parse = parserFactory();
    var token = parse('R#f00;  (K#fa0;) Y#ff0;', 6);
    assert.isObject(token);
    assert.equal(token.value, '  ');
    done();
  });

});
