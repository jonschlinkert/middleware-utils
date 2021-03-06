'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var eslint = require('gulp-eslint');

gulp.task('coverage', function() {
  return gulp.src('index.js')
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire());
});

gulp.task('mocha', ['coverage'], function() {
  return gulp.src('test.js', {read: false})
    .pipe(mocha())
    .pipe(istanbul.writeReports());
});

gulp.task('eslint', function() {
  return gulp.src(['index.js', 'test.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('default', ['mocha', 'eslint']);
