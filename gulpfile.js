'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var jquery = require('gulp-jquery');

gulp.task('jquery', function () {
    return jquery.src({
        release: 2
    })
    .pipe(gulp.dest('./public_html/vendor/'));
});

gulp.task('sass', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('./public_html'));
});

gulp.task('js', function(){
  return gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('application.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public_html'))
});

gulp.task('sass:watch', function () {
  gulp.watch('./src/scss/**/*.scss', ['sass']);
});

gulp.task('js:watch', function () {
  gulp.watch('./src/js/**/*.js', ['js']);
});

gulp.task('default', [ 'jquery', 'js', 'sass', 'sass:watch', 'js:watch' ]);