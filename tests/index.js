'use strict';

var assert = require('chai').assert;
var packageInfo = require('../package.json');
var tartan = require('../src');

describe('Core', function() {

  it('Should check library interface', function(done) {
    assert.equal(tartan.version, packageInfo.version);

    assert(tartan.parse, 'Parser should be exported');
    assert(tartan.process, 'Processors should be exported');
    assert(tartan.render, 'Renderers should be exported');
    assert(tartan.defaults, 'Defaults should be exported');

    done();
  });

});
