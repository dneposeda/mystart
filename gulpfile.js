'use strict';

var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync').create();
var gp = require('gulp-load-plugins')();


var SRC_DIR = './src/';
var DIST_DIR = './dist/';
var path = {
	sass: {
		entry: SRC_DIR + 'style/main.scss',
		src: SRC_DIR + 'style/**/*.scss',
		dist: DIST_DIR + 'css'
	},
	pug: {
		entry: SRC_DIR + 'pug/*.pug',
		src: SRC_DIR + 'pug/**/*.pug',
		dist: DIST_DIR
	},
	sprite: {
		src: SRC_DIR + 'img/sprite/*.png',
		distImg: DIST_DIR + 'img/sprite',
		imgLocation: '../img/sprite/sprite.png',
		distFiles: SRC_DIR + 'style/sprite'
	}
};


gulp.task('del', function() {
	return del([DIST_DIR]);
});


gulp.task('sass', function () {
	return gulp.src(path.sass.entry)
		.pipe(gp.sourcemaps.init())
		.pipe(gp.sassGlob())
		.pipe(gp.sass().on('error', gp.sass.logError))
		.pipe(gp.autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false
		}))
		.pipe(gp.csso())
		.pipe(gp.sourcemaps.write('./maps'))
		.pipe(gulp.dest(path.sass.dist))
});

gulp.task('pug', function () {
	return gulp.src(path.pug.entry)
		.pipe(gp.pug({
			pretty: true
		}))
		.pipe(gulp.dest(path.pug.dist))
});


gulp.task('serv', function() {
	browserSync.init({
		open: false,
		server: "./dist"
	});
	browserSync.watch('dist', browserSync.reload);
});
 

gulp.task('watch', function () {
	gulp.watch(path.sass.src, gulp.series('sass'));
	gulp.watch(path.pug.src, gulp.series('pug'));
});

gulp.task('default', gulp.series(
	gulp.parallel('pug', 'sass'),
	gulp.parallel('watch', 'serv')
));