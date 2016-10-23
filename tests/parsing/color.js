'use strict';

var _ = require('lodash');
var assert = require('chai').assert;
var tartan = require('../../src');

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
  'R=f00;', // No '#'
  '#f00',
  'R=f00;',
  'R=#ff00;' // Invalid color
];

describe('Color parser', function() {

  it('Should create parser', function(done) {
    var parse = tartan.parse.color();
    assert.isFunction(parse);
    done();
  });

  it('Should parse', function(done) {
    var parse = tartan.parse.color();
    _.each(acceptedSyntax, function(sample) {
      var token = parse(sample);
      assert.isObject(token);
      assert((token.name == 'R') || (token.name == 'AZ'), 'Token name invalid');
      assert.equal(token.color, '#ff0000');
    });
    done();
  });

  it('Should not parse', function(done) {
    var parse = tartan.parse.color();
    _.each(invalidSyntax, function(sample) {
      var token = parse(sample);
      assert.isNotObject(token);
    });
    done();
  });

  it('Should respect offset', function(done) {
    var parse = tartan.parse.color();
    var token = parse('R#f00; K#fa0; Y#ff0;', 7);
    assert.isObject(token);
    assert.equal(token.name, 'K');
    assert.equal(token.color, '#ffaa00');
    done();
  });

});
