const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const pump = require('pump');
const runSequence = require('run-sequence');

const $ = require('gulp-load-plugins')();

const source = 'source/';
const build = 'build/';

const htmlSource = `${source}**/*.html`;
const scssSource = `${source}scss/**/*.scss`;
const jsSource = `${source}js/**/*.js`;

gulp.task('browserSync', () => browserSync.init({server: {baseDir: build}}));

gulp.task('html', () => gulp.src(htmlSource)
  .pipe(gulp.dest(build)));

gulp.task('sass', () => gulp.src(scssSource)
  .pipe($.sourcemaps.init())
  .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest(`${build}css`))
  .pipe(browserSync.stream()));

gulp.task('js', () => pump([
  gulp.src(jsSource),
  $.sourcemaps.init(),
  $.babel({presets: ['es2015']}),
  $.uglify(),
  $.concat('main.js'),
  $.sourcemaps.write(),
  gulp.dest(`${build}js`)
]));

gulp.task('clean', () => del.sync(build));

gulp.task('watch', () => {
  gulp.watch(scssSource, ['sass']);
  gulp.watch(jsSource, ['js']);
  gulp.watch(htmlSource, ['html']).on('change', browserSync.reload);
});

gulp.task('default', (callback) =>
  runSequence(['html', 'sass', 'js', 'browserSync'], 'watch', callback));
