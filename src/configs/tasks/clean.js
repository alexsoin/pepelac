import gulp from "gulp";
import rimraf from "gulp-rimraf";
import paths from "../paths.config.js";


/** Очистка папки dist */
export default function clean() {
	return gulp.src(paths.clean, { read: false })
		.pipe(rimraf());
}
