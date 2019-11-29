'use strict';

/* подключаем gulp и плагины */
const gulp = require('gulp');                                   // подключаем Gulp
const browserSync = require('browser-sync').create();           // сервер для работы и автоматического обновления страниц
const plumber = require('gulp-plumber');                        // модуль отслеживания ошибок
const rigger = require('gulp-rigger');                          // модуль импорта содержимого одного файла в другой
const sass = require('gulp-sass');                              // модуль компиляции SASS (SCSS) в CSS
const autoprefixer = require('gulp-autoprefixer');              // модуль автоматической установки автопрефиксов
const cleanCSS = require('gulp-clean-css');                     // плагин минимизации CSS
const uglify = require('gulp-uglify-es').default;               // модуль минимизации JavaScript
const cache = require('gulp-cache');                            // модуль кэширования
const imagemin = require('gulp-imagemin');                      // плагин сжатия PNG, JPEG, GIF и SVG изображений
const jpegrecompress = require('imagemin-jpeg-recompress');     // плагин сжатия jpeg	
const pngquant = require('imagemin-pngquant');                  // плагин сжатия png
const rimraf = require('gulp-rimraf');                          // плагин удаления файлов и каталогов
const rename = require('gulp-rename');                          // плагин переименовывания файлов
const stripCssComments = require('gulp-strip-css-comments');
const twig = require('gulp-twig');
const htmlbeautify = require('gulp-html-beautify');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const webpack = require('webpack-stream');
const strip = require('gulp-strip-comments');

const argv = require('yargs').argv;
const developer = !!argv.developer;
const production = !!argv.production;

const isMode = developer ? 'dev' : 'prod';
const dataMode = require(`./src/data/${isMode}.json`);
const dataSite = require(`./src/data/site.json`);

/* пути */
const paths = {
	root: './dist',
	dist: {
		html: 'dist/',
		js: 'dist/assets/js/',
		css: 'dist/assets/css/',
		img: 'dist/assets/img/',
		fonts: 'dist/assets/fonts/'
	},
	src: {
		html: 'src/*.html',
		twig: 'src/views/*.twig',
		script: 'src/assets/js/main.js',
		style: 'src/assets/style/main.scss',
		img: 'src/assets/img/**/*.*',
		fonts: 'src/assets/fonts/**/*.*'
	},
	watch: {
		html: 'src/**/*.html',
		twig: 'src/views/**/*.twig',
		js: 'src/assets/js/**/*.js',
		scss: 'src/assets/style/**/*.scss',
		img: 'src/assets/img/**/*.*',
		fonts: 'src/assets/fonts/**/*.*'
	},
	clean: './dist/*'
};

/* задачи */

// слежка
function watch() {
	gulp.watch(paths.watch.scss, styles);
	gulp.watch(paths.watch.twig, templates);
	gulp.watch(paths.watch.js, scripts);
}

// следим за dist и релоадим браузер
function server() {
	browserSync.init({ server: paths.root });
	browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

// очистка
function clean() {
	return gulp.src(paths.clean, { read: false })
		.pipe(rimraf());
}

// templates
function templates() {
	return gulp.src(paths.src.twig)
		.pipe(twig({
			data: {
				mode: dataMode,
				site: dataSite
			}
	}))
		.pipe(gulpif(production, htmlbeautify()))
		.pipe(gulp.dest(paths.dist.html));
}

// scss
function styles() {
	return gulp.src(paths.src.style)									// получим main.scss
		.pipe(gulpif(developer, sourcemaps.init()))
		.pipe(sourcemaps.init())
		.pipe(plumber())                								// для отслеживания ошибок
		.pipe(sass({ includePaths: ['node_modules'] })
			.on('error', sass.logError))                  // scss -> css
		.pipe(plumber.stop())
		.pipe(stripCssComments())
		.pipe(autoprefixer()) 													// добавим префиксы
		.pipe(gulpif(developer, sourcemaps.write()))
		.pipe(gulp.dest(paths.dist.css)) 								// выгружаем не минимизарованную версию
		.pipe(rename({ suffix: '.min' }))
		.pipe(cleanCSS())                           		// минимизируем CSS
		.pipe(gulp.dest(paths.dist.css));            		// выгружаем в dist
}

// js
function scripts() {
	return gulp.src(paths.src.script)
		.pipe(webpack( require('./webpack.config.js') ))
		.pipe(gulpif(production, strip()))
		.pipe(gulp.dest(paths.dist.js))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())                 	// минимизируем js
		.pipe(gulp.dest(paths.dist.js));	// выгружаем в dist
}

// fonts
function fonts() {
	return gulp.src(paths.src.fonts)
		.pipe(gulp.dest(paths.dist.fonts));
};

// обработка картинок
function images() {
	return gulp.src(paths.src.img)                       			// путь с исходниками картинок
		.pipe(cache(imagemin([                          				// сжатие изображений
			imagemin.gifsicle({ interlaced: true }),
			jpegrecompress({
				progressive: true,
				max: 90,
				min: 80
			}),
			pngquant(),
			imagemin.svgo({ plugins: [{ removeViewBox: false }] })
		])))
		.pipe(gulp.dest(paths.dist.img));               				// выгрузка готовых файлов
};

exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.clean = clean;

gulp.task('default', gulp.series(
	clean,
	gulp.parallel(fonts, images, styles, scripts, templates),
	gulp.parallel(watch, server)
));

gulp.task('build', gulp.series(
	clean,
	gulp.parallel(fonts, images, styles, scripts, templates)
));
