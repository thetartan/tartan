'use strict';

var _ = require('lodash');
var assert = require('chai').assert;
var parserFactory = require('../../src/parse/stripe');

var acceptedSyntax = [
  'R1',
  'R10',
  'RR2',
  'RR20'
];

var invalidSyntax = [
  '',
  '   ',
  'R0',
  'R',
  '12'
];

describe('Stripe parser', function() {

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
    });
    done();
  });

  it('Should not parse', function(done) {
    var parse = parserFactory();
    _.each(invalidSyntax, function(sample) {
      var token = null;
      try {
        token = parse(sample);
      } catch (e) {
      }

      assert.isNotObject(token);
    });
    done();
  });

  it('Should respect offset', function(done) {
    var parse = parserFactory();
    var token = parse('R#f00; K15Y#ff0;', 7);
    assert.isObject(token);
    assert.equal(token.name, 'K');
    assert.equal(token.count, 15);
    done();
  });

});
