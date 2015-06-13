# middleware-utils [![NPM version](https://badge.fury.io/js/middleware-utils.svg)](http://badge.fury.io/js/middleware-utils)

> Utils for Template middleware.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i middleware-utils --save
```

## Usage

```js
var utils = require('middleware-utils');
```

## API

### [.series](index.js#L29)

Run middleware in series

**Params**

* `fns` **{Array}**: Array of middleware functions

**Example**

```js
var middleware = require('./middleware/');

template.onLoad(/\.js$/, utils.series([
  middleware.foo,
  middleware.bar,
  middleware.baz,
]));
```

### [.parallel](index.js#L53)

Run middleware in parallel.

**Params**

* `fns` **{Array}**: Array of middleware functions

**Example**

```js
var middleware = require('./middleware/');

template.onLoad(/\.js$/, utils.parallel([
  middleware.foo,
  middleware.bar,
  middleware.baz,
]));
```

### [.error](index.js#L75)

Output a formatted middleware error.

**Params**

* `methodName` **{String}**: The middleware method name (verb)

**Example**

```js
template.postRender(/./, function (file, next) {
  // do stuff to file
  next();
}, utils.error('postRender'));
```

### [.handleError](index.js#L98)

Handle middleware errors for the `.handle()` method.

**Params**

* `file` **{Object}**: Vinyl file object or template object.
* `methodName` **{String}**: The middleware method name (verb)

**Example**

```js
template.handle('onFoo', file, utils.handleError(file, 'onFoo'));
```

## Related projects

* [assemble](http://assemble.io): Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt,… [more](http://assemble.io)
* [template](https://github.com/jonschlinkert/template): Render templates using any engine. Supports, layouts, pages, partials and custom template types. Use template… [more](https://github.com/jonschlinkert/template)
* [template-utils](https://github.com/jonschlinkert/template-utils): Utils for [Template](https://github.com/jonschlinkert/template), and Template-based applications.
* [utils](https://github.com/jonschlinkert/utils): Fast, generic JavaScript/node.js utility functions.
* [verb](https://github.com/assemble/verb): Documentation generator for GitHub projects. Extremely powerful, easy to use, can generate anything from API… [more](https://github.com/assemble/verb)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/middleware-utils/issues/new)

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on June 13, 2015._
