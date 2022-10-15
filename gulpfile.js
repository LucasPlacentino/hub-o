/* File: gulpfile.js */
/* jshint node: true */
'use strict';

// grab our packages
var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var hash = require('gulp-hash');
var del = require('del');
var util = require('gulp-util');
var postcss = require('gulp-postcss');
var postcssPresetEnv = require('postcss-preset-env');

var postCSSconfig = [
  postcssPresetEnv({}),
  require('cssnano')
];

var src = './src',
    vnd = './vendor',
    dst = './static',
    scssSrc = src + '/scss',
    scssVnd = vnd + '/scss',
    scssDst = dst + '/css',
    jsSrc = src + '/js',
    jsVnd = vnd + '/js',
    jsDst = dst + '/js',
    fontDst = dst + '/fonts';


gulp.task('build', function(callback) {
    gulp.series('vendor', 'pack-css', 'pack-js');
});

gulp.task('pack-js', function (done) {
    return gulp.src([jsVnd + '/**/*.js', jsSrc + '/**/*.js'])
        .pipe(concat('hub-o.js'))
        .pipe(util.env.debug ? util.noop() : uglify())
        .pipe(gulp.dest(jsDst));
        done();
});

gulp.task('pack-css', function (done) {
    return gulp.src([scssVnd + '/**/*.css',
                     scssVnd + '/**/*.scss',
                     scssSrc + '/**/*.css',
                     scssSrc + '/**/*.scss'])
        .pipe(sass({
          errLogToConsole: true
        }))
        .pipe(concat('hub-o.css'))
        .pipe(postcss(postCSSconfig))
   .pipe(gulp.dest(scssDst));
   done();
});

gulp.task('vendor', function () {
    // del([scssDst + '/font-awesome.*', fontDst]);
    gulp.src(['./node_modules/font-awesome/css/font-awesome.css'])
        .pipe(gulp.dest(scssVnd));

    gulp.src(['./node_modules/font-awesome/fonts/*'])
        .pipe(gulp.dest(fontDst));

    gulp.src(['./node_modules/shufflejs/dist/shuffle.js'])
        .pipe(gulp.dest(jsVnd));

    gulp.src(['./node_modules/tinycolor2/tinycolor.js'])
        .pipe(gulp.dest(jsVnd));
});

// configure which files to watch and what tasks to use on file changes

gulp.task('watch:css', function() {
  return gulp.watch(['src/**/*css'],
  gulp.parallel('pack-css'));
});

gulp.task('watch:js', function() {
  return gulp.watch(['src/**/*.js'],
  gulp.parallel('pack-js'));
});

gulp.task('watch', gulp.parallel('watch:js', 'watch:css'));

gulp.task('default', gulp.series('build'));
