'use strict';

var utils = require('./');
var File = require('vinyl');
var file = new File({path: 'example.txt'});

var fn = utils.series([
  function(file, next) {
    file.count = 0;
    // console.log(file)
    next();
  },
  function(file, next) {
    file.count++;
    next();
  },
  function(file, next) {
    file.count++;
    next();
  },
  function(file, next) {
    file.count++;
    next();
  }
]);

fn(file, function(err, file) {
  console.log(file.count)
});
