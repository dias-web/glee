const {
  src,
  dest,
  watch,
  parallel,
  series
} = require('gulp');

const browserSync = require('browser-sync').create();
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const fileInclude = require('gulp-file-include');


const browsersync = () => {
  browserSync.init({
    server: {
      baseDir: 'build/'
    },
    notify: false,
  })
};

const styles = () => {
  return src('app/scss/style.scss')
    .pipe(scss({
      outputStyle: 'compressed'
    }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream())
};

const scripts = () => {
  return src(['app/js/index.js'])
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(dest('build/js'))
    .pipe(browserSync.stream())
};

const html = () => {
  return src(['app/*.html', '!app/parts/**/*.html'])
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file',
      }),
    )
    .pipe(dest('./build'))
    .pipe(browserSync.stream());
};

const toBuild = () => {
  return src(['app/fonts/**/*', 'app/images/**/*'], {
    base: 'app',
  }).pipe(dest('build'));
};

const watching = () => {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/index.js', '!app/js/index.min.js'], scripts);
  watch(['app/**/*.html'], html);
  watch(['app/**/*.html']).on('change', browserSync.reload);
};

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.html = html;

exports.default = series(parallel(styles, scripts, html, toBuild), parallel(browsersync, watching));