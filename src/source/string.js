'use strict';

var _ = require('lodash');

function factory(string) {
  return function() {
    return _.extend(
      {warp: ''},
      _.isObject(string) ? string : {warp: '' + string}
    );
  };
}

module.exports = factory;
