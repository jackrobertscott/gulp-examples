'use strict';

var path = require('path');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var data = require('gulp-data');
var jade = require('gulp-jade');
var nunjucks = require('gulp-nunjucks-render');
var frontMatter = require('gulp-front-matter');
var markdown = require('gulp-markdown');
var layout = require('gulp-layout');
var ts = require('gulp-typescript');
var coffee = require('gulp-coffee');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var config = require('../config');
var helpers = require('./helpers');

gulp.task('html', function() {
  return gulp.src(helpers.src(config.paths.src, '.html'))
    .pipe(gulp.dest(config.paths.tmp));
});

gulp.task('jade', function() {
  return gulp.src(helpers.src(config.paths.src, '.jade'))
    .pipe(data(function(file) {
      return helpers.locals(file);
    }))
    .pipe(jade({
      pretty: true,
    }))
    .pipe(gulp.dest(config.paths.tmp));
});

gulp.task('nunjucks', function() {
  return gulp.src(helpers.src(config.paths.src, '.nunjucks'))
    .pipe(data(function(file) {
      return helpers.locals(file);
    }))
    .pipe(nunjucks())
    .pipe(gulp.dest(config.paths.tmp));
});

gulp.task('markdown', function() {
  return gulp.src(helpers.src(config.paths.src, ['.md', '.markdown']))
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      var fmData = file.frontMatter;
      fmData.layout = helpers.absPath(fmData.layout);
      return fmData;
    }))
    .pipe(gulp.dest(config.paths.tmp));
});

gulp.task('js', function() {
  return gulp.src(helpers.src(config.paths.src, '.js'))
    .pipe(gulp.dest(config.paths.tmp));
});

gulp.task('ts', function() {
  return gulp.src(helpers.src(config.paths.src, '.ts'))
    .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
    .pipe(ts())
    .js
    .pipe(gulpif(config.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(config.paths.tmp));
});

gulp.task('coffee', function() {
  return gulp.src(helpers.src(config.paths.src, '.coffee'))
    .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
    .pipe(coffee())
    .pipe(gulpif(config.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(config.paths.tmp));
});

gulp.task('css', function() {
  return gulp.src(helpers.src(config.paths.src, '.css'))
    .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
    .pipe(autoprefixer())
    .pipe(gulpif(config.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(config.paths.tmp));
});

gulp.task('less', function() {
  return gulp.src(helpers.src(config.paths.src, '.less'))
    .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulpif(config.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(config.paths.tmp));
});

gulp.task('sass', function() {
  return gulp.src(helpers.src(config.paths.src, ['.sass', '.scss']))
    .pipe(gulpif(config.sourcemaps, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpif(config.sourcemaps, sourcemaps.write()))
    .pipe(gulp.dest(config.paths.tmp));
});

gulp.task('images', function() {
  return gulp.src(helpers.src(config.paths.src, ['.gif', '.jpeg', '.jpg', '.png', '.svg']))
    .pipe(imagemin())
    .pipe(gulp.dest(config.paths.tmp));
});

gulp.task('other', function() {
  return gulp.src(helpers.other(config.paths.src))
    .pipe(gulp.dest(config.paths.tmp));
});
