'use strict';

var _ = require('lodash');
var assert = require('chai').assert;
var tartan = require('../../src');

var acceptedSyntax = ['[', ']'];

var invalidSyntax = [
  '',
  '   ',
  'test' // any other character
];

describe('Square brackets parser', function() {

  it('Should create parser', function(done) {
    var parse = tartan.parse.squareBrackets();
    assert.isFunction(parse);
    done();
  });

  it('Should parse', function(done) {
    var parse = tartan.parse.squareBrackets();
    _.each(acceptedSyntax, function(sample) {
      var token = parse(sample);
      assert.isObject(token);
      assert.equal(token.value, sample);
    });
    done();
  });

  it('Should not parse', function(done) {
    var parse = tartan.parse.squareBrackets();
    _.each(invalidSyntax, function(sample) {
      var token = parse(sample);
      assert.isNotObject(token);
    });
    done();
  });

  it('Should respect offset', function(done) {
    var parse = tartan.parse.squareBrackets();
    var token = parse('R#f00; [K#fa0;] Y#ff0;', 7);
    assert.isObject(token);
    assert.equal(token.value, '[');
    done();
  });

});
