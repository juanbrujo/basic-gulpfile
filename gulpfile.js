/*
* Base Gulp.js workflow
* for simple front-end projects
* includes: LESS / MinifyCSS / Compress JS / ImageMin / LiveReload
* Dependency: LiveReload Plugin http://goo.gl/7WNncw
* Once enabled:
*   $ gulp 
*   point Chrome to: localhost:4000/
*/
var 
    connect, 
    gutil,
    gulp, 
    lr, 
    refresh, 
    less, 
    server,
    path,
    watch,
    minifyCSS,
    uglify,
    imagemin;

gulp = require('gulp');
gutil = require('gulp-util');
uglify = require('gulp-uglify');
less = require('gulp-less');
refresh = require('gulp-livereload');
connect = require('connect');
http = require('http');
path = require('path');
lr = require('tiny-lr');
watch = require('gulp-watch');
minifyCSS = require('gulp-minify-css');
imagemin = require('gulp-imagemin');
server = lr();

gulp.task('webserver', function() {
  var app, base, directory, hostname, port;
  port = 4000;
  hostname = null;
  base = path.resolve('.');
  directory = path.resolve('.');
  app = connect()
        .use(connect["static"](base))
        .use(connect.directory(directory));
  return http.createServer(app)
        .listen(port, hostname);
});

gulp.task('livereload', function() {
  return server.listen(35729, function(err) {
    if (err != null) {
      return console.log(err);
    }
  });
});

gulp.task('scripts', function() {
  return gulp.src('js/*.js')
    .pipe(uglify({outSourceMaps: true}))
    .pipe(gulp.dest('assets/js'))
    .pipe(refresh(server));
});

gulp.task('styles', function() {
  return gulp.src('css/*.less')
    .pipe(watch())
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('assets/css'))
    .pipe(refresh(server));
});

gulp.task('imagemin', function () {
    return gulp.src('images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('assets/images'));
});

gulp.task('html', function() {
  return gulp.src('*.html').pipe(refresh(server));
});

gulp.task('default', function() {
  gulp.run('webserver', 'livereload', 'scripts', 'styles');
  gulp.watch('js/**', function() {
    return gulp.run('scripts');
  });
  gulp.watch('css/**', function() {
    return gulp.run('styles');
  });
  gulp.watch('images/**', function() {
    return gulp.run('imagemin');
  });
  gulp.watch('*.html', function() {
    return gulp.run('html');
  });
});