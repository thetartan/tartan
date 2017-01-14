'use strict';

/* global window */

var _ = require('lodash');

var requestAnimationFrame = (function() {
  var result = null;
  if (typeof window != 'undefined') {
    if (_.isObject(window)) {
      result = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    }
  }
  return result || setTimeout;
})();

var cancelAnimationFrame = (function() {
  var result = null;
  if (typeof window != 'undefined') {
    if (_.isObject(window)) {
      result = window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.msCancelAnimationFrame;
    }
  }
  return result || clearTimeout;
})();

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

  result.flush = function() {
    result.cancel();
    repaint();
    return this;
  };

  result.cancel = function() {
    if (callbackId) {
      cancelAnimationFrame(callbackId);
    }
    callbackId = null;
    callbackContext = null;
    return this;
  };

  return result;
}

module.exports = factory;
