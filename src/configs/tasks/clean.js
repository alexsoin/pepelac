const gulp = require('gulp');
const rimraf = require('gulp-rimraf');

const paths = require('../paths.config.js');


/** Очистка папки dist */
exports.clean = function clean() {
	return gulp.src(paths.clean, { read: false })
		.pipe(rimraf());
}
