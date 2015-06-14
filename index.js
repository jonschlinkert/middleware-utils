/*!
 * middleware-utils <https://github.com/jonschlinkert/middleware-utils>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var async = require('async');
var red = require('ansi-red');
var yellow = require('ansi-yellow');

/**
 * Run middleware in series
 *
 * ```js
 * var middleware = require('./middleware/');
 *
 * template.onLoad(/\.js$/, utils.series([
 *   middleware.foo,
 *   middleware.bar,
 *   middleware.baz,
 * ]));
 * ```
 * @param {Array} `fns` Array of middleware functions
 * @api public
 */

exports.series = function series(fns) {
  return function (file, cb) {
    async.eachSeries(fns, function (fn, next) {
      fn(file, next);
    }, cb);
  };
};

/**
 * Run middleware in parallel.
 *
 * ```js
 * var middleware = require('./middleware/');
 *
 * template.onLoad(/\.js$/, utils.parallel([
 *   middleware.foo,
 *   middleware.bar,
 *   middleware.baz,
 * ]));
 * ```
 * @param {Array} `fns` Array of middleware functions
 * @api public
 */

exports.parallel = function parallel(fns) {
  return function (file, cb) {
    async.each(fns, function (fn, next) {
      fn(file, next);
    }, cb);
  };
};

/**
 * Output a formatted middleware error.
 *
 * ```js
 * template.postRender(/./, function (file, next) {
 *   // do stuff to file
 *   next();
 * }, utils.error('postRender'));
 * ```
 *
 * @param {String} `methodName` The middleware method name (verb)
 * @api public
 */

exports.error = function error(methodName) {
  if (typeof methodName !== 'string') {
    throw new Error('middleware-utils.error() expects `methodName` to be a string.');
  }
  return function (err, file, next) {
    var message = yellow('.%s middleware error:\n%s\nFile: %s:');
    if (err) console.error(message, methodName, err, JSON.stringify(file, null, 2));
    next();
  };
};

/**
 * Handle middleware errors for the `.handle()` method.
 *
 * ```js
 * template.handle('onFoo', file, utils.handleError(file, 'onFoo'));
 * ```
 *
 * @param {Object} `file` Vinyl file object or template object.
 * @param {String} `methodName` The middleware method name (verb)
 * @api public
 */

exports.handleError = function handleError(file, methodName) {
  if (typeof methodName !== 'string') {
    throw new Error('middleware-utils.handleError() expects `methodName` to be a string.');
  }
  return function (err) {
    if (err) {
      console.error(red('Error running `' + methodName + '` middleware for:'), file.path);
      throw err;
    }
  };
};

/**
 * Escape/unescape delimiters
 */

exports.delims = function delims(options) {
  options = options || {};
  options.escapeString = options.escapeString || '__UTILS_DELIM__';
  options.from = options.from || '{%%';
  options.to = options.to || '{%';
  var res = {};

  // escape
  res.escape = function escape(from) {
    from = from || options.from;
    return function(file, next) {
      file.content = file.content.split(from).join(options.escapeString);
      next();
    };
  };

  // unscape
  res.unescape = function unescape(to) {
    to = to || options.to;
    return function(file, next) {
      file.content = file.content.split(options.escapeString).join(to);
      next();
    };
  };
  return res;
};
