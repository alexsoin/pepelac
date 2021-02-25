'use strict';

const fs = require('fs');
const path = require('path');

/* подключаем gulp и плагины */
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const jpegrecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const rimraf = require('gulp-rimraf');
const rename = require('gulp-rename');
const stripCssComments = require('gulp-strip-css-comments');
const twig = require('gulp-twig');
const htmlbeautify = require('gulp-html-beautify');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const webpack = require('webpack-stream');
const strip = require('gulp-strip-comments');
const version = require('gulp-version-number');
const notifier = require('node-notifier');
const rsync = require('gulp-rsync');
const confirm = require('gulp-confirm');

const argv = require('yargs').argv;
const developer = !!argv.developer;
const production = !developer;

const isMode = developer ? 'dev' : 'prod';
const dataMode = require(`./src/data/${isMode}.json`);
const dataSite = require(`./src/data/site.json`);
const webpackConfig = require('./webpack.config.js');
const versionConfig = {
	'value': '%DT%',
	'append': {
		'key': 'v',
		'to': ['css', 'js'],
	},
};

/* пути */
const dirDist = 'dist';
const dirAssets = 'assets';
const dirSrc = 'src';
const dirStatic = 'static';

const paths = {
	root: path.join('.', dirDist),
	clean: path.join('.', dirDist, '*'),
	dist: {
		static: path.join(dirDist),
		html: path.join(dirDist),
		js: path.join(dirDist, dirAssets, 'js'),
		css: path.join(dirDist, dirAssets, 'css'),
		img: path.join(dirDist, dirAssets, 'img'),
		fonts: path.join(dirDist, dirAssets, 'fonts')
	},
	src: {
		static: path.join(dirStatic, '**/*.*'),
		twig: path.join(dirSrc, 'views', '*.twig'),
		script: path.join(dirSrc, dirAssets, 'js', 'main.js'),
		style: path.join(dirSrc, dirAssets, 'styles', 'main.scss'),
		img: path.join(dirSrc, dirAssets, 'img', '**/*.*'),
		fonts: path.join(dirSrc, dirAssets, 'fonts', '**/*.*')
	},
	watch: {
		static: path.join(dirStatic, '**/*.*'),
		twig: path.join(dirSrc, 'views', '**/*.twig'),
		js: path.join(dirSrc, dirAssets, 'js', '**/*.js'),
		scss: path.join(dirSrc, dirAssets, 'styles', '**/*.scss'),
		img: path.join(dirSrc, dirAssets, 'img', '**/*.*'),
		fonts: path.join(dirSrc, dirAssets, 'fonts', '**/*.*')
	}
};

/* задачи */

// слежка
function watch() {
	gulp.watch(paths.watch.static, moveStatic);
	gulp.watch(paths.watch.scss, styles);
	gulp.watch(paths.watch.twig, templates);
	gulp.watch(paths.watch.js, scripts);
	gulp.watch(paths.watch.fonts, fonts);
	gulp.watch(paths.watch.img, images);
}

// следим за dist и релоадим браузер
function server() {
	browserSync.init({ server: dirDist });
	browserSync.watch(path.join(dirDist, '**/*.*'), browserSync.reload);
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
		.pipe(gulpif(production, version(versionConfig)))
		.pipe(gulp.dest(paths.dist.html));
}

// scss
function styles() {
	return gulp.src(paths.src.style)
		.pipe(gulpif(developer, sourcemaps.init()))
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass({ includePaths: ['node_modules'] })
			// .on('error', sass.logError) // оповещение только в терминал
			.on('error', function(err) {
				console.error(err.message);
				notifier.notify({ title: 'Ошибка в SCSS файле!', message: err.message });
				this.emit('end');
			})
		)
		.pipe(plumber.stop())
		.pipe(stripCssComments())
		.pipe(autoprefixer())
		.pipe(gulpif(developer, sourcemaps.write()))
		.pipe(gulp.dest(paths.dist.css))
		.pipe(rename({ suffix: '.min' }))
		.pipe(cleanCSS())
		.pipe(gulp.dest(paths.dist.css));
}

// js
function scripts() {
	return webpack(webpackConfig)
		.pipe(gulpif(production, strip()))
		.pipe(gulp.dest(paths.dist.js));
}

// fonts
function fonts() {
	return gulp.src(paths.src.fonts)
		.pipe(gulp.dest(paths.dist.fonts));
};

// static
function moveStatic() {
	return gulp.src(paths.src.static)
		.pipe(gulp.dest(paths.dist.static));
};

// обработка картинок
function images() {
	return gulp.src(paths.src.img)
		.pipe(cache(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			jpegrecompress({
				progressive: true,
				max: 90,
				min: 80
			}),
			pngquant(),
			imagemin.svgo({ plugins: [{ removeViewBox: false }] })
		])))
		.pipe(gulp.dest(paths.dist.img));
};

// функция для деплоя на сервер
function deployRsync(done) {
	if(!fs.existsSync('./deploy.json')) {
		console.log("Не существует файл deploy.json");
		return done();
	}
	const deployJson = require('./deploy.json');

	if(deployJson.hostname === "xxx@xxx") {
		console.log("Не настроен файл deploy.json")
		return done();
	}

	return gulp.src(deployJson.path)
		.pipe(confirm({
			question: `Вы уверены, что хотите загрузить файлы в ${deployJson.hostname}:${deployJson.destination}? (y/Y)`,
			input: '_key:y,Y'
		}))
		.pipe(rsync({
			root: deployJson.root,
			hostname: deployJson.hostname,
			destination: deployJson.destination,
			exclude: deployJson.exclude,
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
		.on('end', function(){ console.log(`Загружено в ${deployJson.hostname}:${deployJson.destination}`); });
		// .pipe(
		// 	console.log(`Загружено в ${deployJson.hostname}:${deployJson.destination}`)
		// );
}

// инициализируем задачи
exports.moveStatic = moveStatic;
exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.deployRsync = deployRsync;
exports.clean = clean;

gulp.task('default', gulp.series(
	clean,
	gulp.parallel(moveStatic, fonts, images, styles, scripts, templates),
	gulp.parallel(watch, server)
));

gulp.task('build', gulp.series(
	clean,
	gulp.parallel(moveStatic, fonts, images, styles, scripts, templates)
));
