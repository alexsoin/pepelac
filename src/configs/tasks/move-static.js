const gulp = require('gulp');

const paths = require('../paths.config.js');


/** Перемещение статических данных */
exports.moveStatic = function moveStatic() {
	return gulp.src(paths.src.static)
		.pipe(gulp.dest(paths.dist.static));
}
