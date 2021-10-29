const gulp = require('gulp');
const cache = require('gulp-cache');
const image = require('gulp-image');

const paths = require('../paths.config.js');


/** Обработка картинок */
exports.images = function images() {
	return gulp.src(paths.src.img)
		.pipe(cache(image()))
		.pipe(gulp.dest(paths.dist.img));
}
