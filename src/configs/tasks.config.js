const fs = require('fs');

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cache = require('gulp-cache');
const image = require('gulp-image');
const rimraf = require('gulp-rimraf');
const rename = require('gulp-rename');
const twig = require('gulp-twig');
const htmlbeautify = require('gulp-html-beautify');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const webpack = require('webpack-stream');
const version = require('gulp-version-number');
const notifier = require('node-notifier');
const rsync = require('gulp-rsync');
const confirm = require('gulp-confirm');

const argv = require('yargs').argv;
const developer = !!argv.developer;
const production = !developer;

const isMode = developer ? 'dev' : 'prod';
const dataMode = require(`../data/${isMode}.json`);
const dataSite = require(`../data/site.json`);

const versionConfig = require('./version.config.js');
const webpackConfig = require('./webpack.config.js');
const deployConfig = require('./deploy.config.js');
const paths = require('./paths.config.js');

/** Очистка папки dist */
exports.clean = function clean() {
	return gulp.src(paths.clean, { read: false })
		.pipe(rimraf());
}

/** Создание html страниц */
exports.templates = function templates() {
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

/** Сборка javascript файлов */
exports.scripts = function scripts() {
	return webpack(webpackConfig)
		.pipe(gulp.dest(paths.dist.js));
}

/** Перемещение шрифтов */
exports.fonts = function fonts() {
	return gulp.src(paths.src.fonts)
		.pipe(gulp.dest(paths.dist.fonts));
}

/** Перемещение статических данных */
exports.moveStatic = function static() {
	return gulp.src(paths.src.static)
		.pipe(gulp.dest(paths.dist.static));
}

/** Обработка картинок */
exports.images = function images() {
	return gulp.src(paths.src.img)
		.pipe(cache(image()))
		.pipe(gulp.dest(paths.dist.img));
}

/** Создание файла для настройки деплоя */
exports.createDeploy = function createDeploy(done) {
	fs.writeFileSync(deployConfig.filename, JSON.stringify(deployConfig.tmp, null, 2));
	console.log(deployConfig.messages.create.success);
	notifier.notify({ title: deployConfig.messages.create.title, message: deployConfig.messages.create.success });

	done();
}

/** Деплой данных на сервер */
exports.deployRsync = function deployRsync(done) {
	if(!fs.existsSync(paths.deploy)) {
		console.log(deployConfig.messages.deploy.empty);
		notifier.notify({ title: deployConfig.messages.deploy.title, message: deployConfig.messages.deploy.empty });
		createDeploy(done);
		return done();
	}
	const deployJson = require(paths.deploy);
	const deployType = typeof argv.deploy === 'string' ? argv.deploy : deployJson.default;
	const deployData = deployJson[deployType];

	if(!deployData) {
		console.log(deployConfig.messages.deploy.emptyData);
		notifier.notify({ title: deployConfig.messages.deploy.title, message: deployConfig.messages.deploy.emptyData});
		return done();
	}

	if(deployData.hostname === "xxx@xxx") {
		console.log(deployConfig.messages.deploy.errorSettings);
		notifier.notify({ title: deployConfig.messages.deploy.title, message: deployConfig.messages.deploy.errorSettings });
		return done();
	}

	return gulp.src(deployData.root)
		.pipe(confirm({
			question: `Вы уверены, что хотите загрузить файлы в ${deployData.hostname}:${deployData.destination}? (y/Y)`,
			input: '_key:y,Y'
		}))
		.pipe(rsync({
			root: deployData.root,
			hostname: deployData.hostname,
			destination: deployData.destination,
			exclude: deployData.exclude,
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
		.on('end', function(){
			console.log(`Загружено в ${deployData.hostname}:${deployData.destination}`);
			notifier.notify({ title: deployConfig.messages.deploy.title, message: `Загружено в ${deployData.hostname}:${deployData.destination}` });
		});
}
