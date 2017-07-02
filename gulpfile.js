const gulp = require('gulp'),
  $ = require('gulp-load-plugins')();

gulp.task('sass', function () {
  $.rubySass('src/assets/css/main.sass', {
      style: 'compressed',
      'default-encoding': 'utf-8'
    })
    .on('error', $.rubySass.logError)
    .pipe($.autoprefixer('last 10 versions'))
    .pipe(gulp.dest('dist/assets/css/'));
});

gulp.task('pug', function () {
  var vNumConfig = {
    'value': '%MDS%',
    'replaces': [
      /#{VERSION_REPLACE}#/g
    ]
  }
  gulp.src(['src/pages/**/*.pug', '!src/pages/**/_*.pug'])
    .pipe($.pug({
      pretty: true
    }))
    .pipe($.versionNumber(vNumConfig))
    .pipe(gulp.dest('dist/'));

  gulp.src(['src/*.+(png|xml|ico|json|svg)'])
    .pipe(gulp.dest('dist/'));

});

gulp.task('js', function () {
  gulp.src(['src/assets/js/*.js'])
    .pipe($.minify({
      ext: {
        src: '.js',
        min: '.js'
      },
      noSource: true,
      ignoreFiles: ['.min.js']
    }))
    .pipe(gulp.dest('dist/assets/js/'));
  gulp.src(['src/assets/js/*.json'])
    .pipe($.jsonMinify())
    .pipe(gulp.dest('dist/assets/js/'));
});

gulp.task('images', function () {
  return gulp.src('src/assets/images/*')
    .pipe(gulp.dest('dist/assets/images/'));
})

gulp.task('watch', function () {
  gulp.watch(['src/assets/css/**/*'], ['sass']);
  gulp.watch(['src/pages/**/*'], ['pug']);
  gulp.watch(['src/assets/js/**/*'], ['js']);
})

gulp.task('default', ['pug', 'sass', 'js', 'images', 'watch']);