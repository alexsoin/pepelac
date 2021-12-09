import gulp from "gulp";
import cache from "gulp-cache";
import image from "gulp-image";

import paths from "../paths.config.js";


/** Обработка картинок */
export default function images() {
	return gulp.src(paths.src.img)
		.pipe(cache(image()))
		.pipe(gulp.dest(paths.dist.img));
}
