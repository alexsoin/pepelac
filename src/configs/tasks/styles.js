import gulp from "gulp";
import plumber from "gulp-plumber";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import gulpif from "gulp-if";
import notifier from "node-notifier";
import yargs from "yargs";

import paths from "../paths.config.js";


const { argv } = yargs;
const developer = !!argv.developer;
const sass = gulpSass(dartSass);


/** Сборка файлов стилей scss */
export default function styles() {
	return gulp.src(paths.src.style)
		.pipe(gulpif(developer, sourcemaps.init({loadMaps: true, largeFile: true})))
		.pipe(plumber())
		.pipe(sass({ outputStyle: 'compressed', includePaths: ['node_modules'] })
			.on('error', function(err) {
				console.error(err.message);
				notifier.notify({ title: 'Ошибка в SCSS файле!', message: err.message });
				this.emit('end');
			})
		)
		.pipe(plumber.stop())
		.pipe(autoprefixer())
		.pipe(gulpif(developer, sourcemaps.write()))
		.pipe(rename({ basename: 'main.min' }))
		.pipe(gulp.dest(paths.dist.css));
}
