import gulp from "gulp";

import paths from "../paths.config.js";


/** Перемещение статических данных */
export default function moveStatic() {
	return gulp.src(paths.src.static)
		.pipe(gulp.dest(paths.dist.static));
}
