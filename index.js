/*!
 * middleware-utils <https://github.com/jonschlinkert/middleware-utils>
 *
 * Copyright (c) 2015-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var each = require('async-each');
var reduce = require('async-array-reduce');

/**
 * Run one or more middleware in series.
 *
 * ```js
 * var utils = require('middleware-utils');

 * app.preRender(/\.hbs$/, utils.series([
 *   fn('foo'),
 *   fn('bar'),
 *   fn('baz')
 * ]));
 *
 * function fn(name) {
 *   return function(file, next) {
 *     console.log(name);
 *     next();
 *   };
 * }
 * ```
 * @param {Array|Function} `fns` Function or array of middleware functions
 * @api public
 */

exports.series = function(/* middleware fns */) {
  var fns = [].concat.apply([], arguments);
  return (view, cb) => {
    reduce(fns, view, (acc, fn, next) => {
      try {
        fn(acc, handle(acc, next));
      } catch (err) {
        next(err);
      }
    }, handle(view, cb));
  };
};

/**
 * Run one or more middleware in parallel.
 *
 * ```js
 * var utils = require('middleware-utils');

 * app.preRender(/\.hbs$/, utils.parallel([
 *   fn('foo'),
 *   fn('bar'),
 *   fn('baz')
 * ]));
 *
 * function fn(name) {
 *   return function(file, next) {
 *     console.log(name);
 *     next();
 *   };
 * }
 * ```
 * @param {Array|Function} `fns` Function or array of middleware functions
 * @api public
 */

exports.parallel = function(/* middleware fns */) {
  var fns = [].concat.apply([], arguments);
  return (view, cb) => {
    each(fns, (fn, next) => {
      try {
        fn(view, handle(view, next));
      } catch (err) {
        next(err);
      }
    }, handle(view, cb));
  };
};

/**
 * Format errors for the middleware `done` function. Takes the name of the middleware method
 * being handled.
 *
 * ```js
 * app.postRender(/./, function(view, next) {
 *   // do stuff to view
 *   next();
 * }, utils.error('postRender'));
 * ```
 *
 * @param {String} `method` The middleware method name
 * @api public
 */

exports.error = function(method) {
  return (err, view, next) => {
    if (typeof next !== 'function') {
      next = (err) => {
        if (err) throw err;
      };
    }

    if (err) {
      err.method = method;
      err.view = view;
      next(err);
      return;
    }

    next(null, view);
  };
};

/**
 * Format errors for the `app.handle()` method.
 *
 * ```js
 * app.handle('onFoo', view, utils.handleError(view, 'onFoo'));
 * ```
 *
 * @param {Object} `view` View object
 * @param {String} `method` The middleware method name
 * @param {String} `next` Callback function
 * @api public
 */

exports.handleError = function(view, method, next) {
  var handle = exports.error(method);
  return (err) => {
    handle(err, view, next);
  };
};

/**
 * Returns a function for escaping and unescaping erb-style template delimiters.
 *
 * ```js
 * var delims = mu.delims();
 * app.preRender(/\.tmpl$/, delims.escape());
 * app.postRender(/\.tmpl$/, delims.unescape());
 * ```
 * @param {Object} `options`
 * @api public
 */

exports.delims = function(options) {
  options = options || {};
  var escapeString = options.escapeString || '__UTILS_DELIM__';
  options.from = options.from || '{%%';
  options.to = options.to || '{%';
  var memo = {};

  // escape
  memo.escape = (from) => {
    from = from || options.from;
    return (view, next) => {
      view.content = view.content.split(from).join(escapeString);
      next(null, view);
    };
  };

  // unscape
  memo.unescape = (to) => {
    to = to || options.to;
    return (view, next) => {
      view.content = view.content.split(escapeString).join(to);
      next(null, view);
    };
  };
  return memo;
};

/**
 * Ensure file is returned in callback
 */

function handle(file, next) {
  return (err) => next(err, file);
}
