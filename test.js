/*!
 * middleware-utils <https://github.com/jonschlinkert/middleware-utils>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

/* deps:mocha */
var assert = require('assert');
var should = require('should');
var utils = require('./');
var Template = require('template');
var template;

describe('utils', function () {
  beforeEach(function() {
    template = new Template();
    template.engine('*', require('engine-lodash'));
    template.create('page', 'pages');
  });

  describe('.delims():', function () {
    it('should use escape/unescape delims passed on options:', function (cb) {
      var delims = utils.delims({from: '<%%', to: '<%'});

      template.data({bar: 'XYZ'});
      template.page('abc.md', {content: '<%%= foo %><%= bar %>'});
      template.preRender(/./, delims.escape());
      template.postRender(/./, delims.unescape());

      template.render('abc.md', function (err, content) {
        if (err) console.log(err);
        content.should.equal('<%= foo %>XYZ');
        cb();
      });
    });

    it('should use escape/unescape delims passed to methods:', function (cb) {
      var delims = utils.delims();

      template.data({bar: 'XYZ'});
      template.page('abc.md', {content: '<%%= foo %><%= bar %>'});
      template.preRender(/./, delims.escape('<%%'));
      template.postRender(/./, delims.unescape('<%'));

      template.render('abc.md', function (err, content) {
        if (err) console.log(err);
        content.should.equal('<%= foo %>XYZ');
        cb();
      });
    });
  });

  describe('.handleError():', function () {
    it('should handle middleware errors:', function (cb) {
      template.option('router methods', ['onFoo']);

      template.page('abc.md', {content: 'this is content.'});
      template.postRender(/./, function (file, next) {
        next();
      });

      var file = template.getPage('abc.md');
      template.render(file, function (err, content) {
        if (err) console.log(err);
        file.content = content;
        template.handle('postRender', file, utils.handleError(file, 'foo'));
        cb();
      });
    });
  });
});
