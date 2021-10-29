const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const notifier = require('node-notifier');

const argv = require('yargs').argv;
const developer = !!argv.developer;

const paths = require('../paths.config.js');


/** Сборка файлов стилей scss */
exports.styles = function styles() {
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
