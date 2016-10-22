'use strict';

/* global window */

var _ = require('lodash');

var requestAnimationFrame = (function(window) {
  var result = null;
  if (_.isObject(window)) {
    result = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  }
  return result || setTimeout;
})(window);

function factory(callback) {
  if (!_.isFunction(callback)) {
    return _.identity;
  }

  var callbackId = null;
  var callbackContext = null;
  function repaint() {
    callbackId = null;
    callbackContext = null;
    callback(callbackContext);
  }

  var result = function(context) {
    if (!callbackId) {
      callbackId = requestAnimationFrame(repaint);
      callbackContext = context;
    }
  };

  result.cancel = function() {
    callbackId = null;
    callbackContext = null;
    return this;
  };

  return result;
}

module.exports = factory;
