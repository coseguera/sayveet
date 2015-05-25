'use strict';

var gulp = require('gulp');
var gulpJshint = require('gulp-jshint');
var gulpJasmine = require('gulp-jasmine');

gulp.task('default', ['lint']);
gulp.task('test', ['jasmine']);

gulp.task('lint', function () {
    gulp.src('./**/*.js')
    .pipe(gulpJshint())
    .pipe(gulpJshint.reporter('default'));
});

gulp.task('jasmine', function () {
    return gulp.src('./spec/**/*[sS]pec.js')
    .pipe(gulpJasmine());
});