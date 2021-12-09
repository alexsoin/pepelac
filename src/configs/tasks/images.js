import gulp from "gulp";
import image from "gulp-image";
import gulpif from "gulp-if";
import yargs from "yargs";

import paths from "../paths.config.js";

const { argv } = yargs;
const developer = !!argv.developer;
const production = !developer;

/** Обработка картинок */
export default function images() {
	return gulp.src(paths.src.img)
		.pipe(gulpif(production, image()))
		.pipe(gulp.dest(paths.dist.img));
}
