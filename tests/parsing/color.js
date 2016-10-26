'use strict';

var _ = require('lodash');
var assert = require('chai').assert;
var parserFactory = require('../../src/parse/token/color');

var acceptedSyntax = [
  'R#f00;',
  'R=#f00;',
  'R#ff0000;',
  'R=#ff0000;',

  'AZ#f00;',
  'AZ=#f00;',
  'AZ#ff0000;',
  'AZ=#ff0000;'
];

var invalidSyntax = [
  '',
  '   ',
  'R#f00', // No ';'
  '#f00',
  'R=#ff00;' // Invalid color
];

describe('Color parser', function() {

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
      assert((token.name == 'R') || (token.name == 'AZ'), 'Token name invalid');
      assert.equal(token.color, '#ff0000');
    });
    done();
  });

  it('Should not parse', function(done) {
    var parse = parserFactory({
      semicolonAtTheEnd: 'require'
    });
    _.each(invalidSyntax, function(sample) {
      var token = parse(sample);
      assert.isNotObject(token);
    });
    done();
  });

  it('Should respect offset', function(done) {
    var parse = parserFactory();
    var token = parse('R#f00; K#fa0; Y#ff0;', 7);
    assert.isObject(token);
    assert.equal(token.name, 'K');
    assert.equal(token.color, '#ffaa00');
    done();
  });

});
