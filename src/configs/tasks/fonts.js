const gulp = require('gulp');

const paths = require('../paths.config.js');


/** Перемещение шрифтов */
exports.fonts = function fonts() {
	return gulp.src(paths.src.fonts)
		.pipe(gulp.dest(paths.dist.fonts));
}
