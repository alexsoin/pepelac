import gulp from "gulp";

import paths from "../paths.config.js";


/** Перемещение шрифтов */
export default function fonts() {
	return gulp.src(paths.src.fonts)
		.pipe(gulp.dest(paths.dist.fonts));
}
