const gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  pug = require('gulp-pug'),
  prefix = require('gulp-autoprefixer'),
  versionNumber = require('gulp-version-number'),
  useref = require('gulp-useref');

gulp.task('sass', function () {
  sass('src/assets/css/main.sass', {
      style: 'compressed',
      'default-encoding': 'utf-8'
    })
    .on('error', sass.logError)
    .pipe(prefix('last 15 versions'))
    .pipe(gulp.dest('dist/assets/css/'));
});

gulp.task('pug', function () {
  var vNumConfig = {
    'value': '%MDS%',
    'append': {
      'key': 'v',
      'to': ['css', 'js']
    }
  }
  gulp.src(['src/pages/**/*.pug', '!src/pages/**/_*.pug'])
    .pipe(pug({
      pretty: true
    }))
    .pipe(useref())
    .pipe(versionNumber(vNumConfig))
    .pipe(gulp.dest('dist/'))

  gulp.src(['src/assets/js/*.json'])
    .pipe(gulp.dest('dist/assets/js'));

  gulp.src(['src/*.+(png|xml|ico|json|svg)'])
    .pipe(gulp.dest('dist/'));

});

gulp.task('images', function () {
  return gulp.src('src/assets/images/*')
    .pipe(gulp.dest('dist/assets/images/'));
})

gulp.task('watch', function () {
  gulp.watch(['src/assets/css/**/*'], ['sass']);
  gulp.watch(['src/pages/**/*.pug'], ['pug']);
  gulp.watch(['src/assets/js/**/*'], ['js']);
})

gulp.task('default', ['pug', 'sass', 'images', 'watch']);