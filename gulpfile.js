'use strict';

var gulp = require("gulp"),
    sourcemaps = require("gulp-sourcemaps"),
    babel = require("gulp-babel"),
    concat = require("gulp-concat"),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babelify = require('babelify'),
    gutil = require('gulp-util'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    paths = {
        scripts: ['./app/main.jsx']
    };

var dependencies = [
  'alt',
  'react',
  'react-dom',
  'react-router'
];

gulp.task('browserify-vendor', function() {
  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('public/compiled'));
});


gulp.task('scripts', ['browserify-vendor'], function() {
  var bundler = watchify(browserify({ entries: ['./app/wallet.jsx']}, watchify.args));
  bundler.transform(babelify, { presets: ['es2015', 'react'], plugins: ['transform-react-jsx']});
  bundler.on('update', rebundle);
  return rebundle();

  function rebundle() {
    var start = Date.now();
    return bundler.bundle()
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .on('end', function() {
        gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
      })
      .pipe(source('wallet.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/compiled'));
  }
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['browserify']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts']);
gulp.task('build', ['scripts']);
