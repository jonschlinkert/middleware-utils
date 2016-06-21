/*!
 * middleware-utils <https://github.com/jonschlinkert/middleware-utils>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

require('mocha');
var assert = require('assert');
var assemble = require('assemble-core');
var utils = require('./');
var app;

describe('utils', function() {
  beforeEach(function() {
    app = assemble();
    app.engine('md', require('engine-base'));
    app.create('page', 'pages');
  });

  describe('.series', function() {
    it('should run an array of middleware:', function(cb) {
      var count = 0;

      function fn(n) {
        return function(view, next) {
          count += n;
          next();
        };
      }

      app.preRender(/\.md$/, utils.series([
        fn(1),
        fn(2),
        fn(1),
        fn(2)
      ]));

      app.page('abc.md', {content: 'this is abc'});

      app.render('abc.md', function(err, view) {
        if (err) return cb(err);
        assert.equal(count, 6);
        assert.equal(view.content, 'this is abc');
        cb();
      });
    });
  });

  describe('.parallel', function() {
    it('should run an array of middleware:', function(cb) {
      var count = 0;

      function fn(n) {
        return function(view, next) {
          count += n;
          next();
        };
      }

      app.onLoad(/\.md$/, utils.parallel([
        fn(1),
        fn(2),
        fn(1),
        fn(2)
      ]));

      app.page('abc.md', {content: 'this is abc'});

      app.render('abc.md', function(err, view) {
        if (err) return cb(err);
        assert.equal(count, 6);
        assert.equal(view.content, 'this is abc');
        cb();
      });
    });
  });

  describe('.delims', function() {
    it('should use escape/unescape delims passed on options:', function(cb) {
      var delims = utils.delims({from: '<%%', to: '<%'});

      app.data({bar: 'XYZ'});
      app.page('abc.md', {content: '<%%= foo %><%= bar %>'});
      app.preRender(/./, delims.escape());
      app.postRender(/./, delims.unescape());

      app.render('abc.md', function(err, view) {
        if (err) return cb(err);
        assert.equal(view.content, '<%= foo %>XYZ');
        cb();
      });
    });

    it('should use escape/unescape delims passed to methods:', function(cb) {
      var delims = utils.delims();

      app.data({bar: 'XYZ'});
      app.page('abc.md', {content: '<%%= foo %><%= bar %>'});
      app.preRender(/./, delims.escape('<%%'));
      app.postRender(/./, delims.unescape('<%'));

      app.render('abc.md', function(err, view) {
        if (err) return cb(err);
        assert.equal(view.content, '<%= foo %>XYZ');
        cb();
      });
    });
  });

  describe('.handleError', function() {
    it('should handle middleware errors:', function(cb) {
      app.handler('custom');
      app.page('abc.md', {content: 'this is content.'});
      app.custom(/./, function(file, next) {
        next(new Error('foo'));
      });

      app.render('abc.md', function(err, view) {
        if (err) return cb(err);

        app.handle('custom', view, utils.handleError(view, 'custom', function(err) {
          assert.equal(err.method, 'custom');
          assert(err.view);
          assert.equal(err.view.basename, 'abc.md');
          cb();
        }));
      });
    });
  });
});
