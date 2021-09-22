'use strict';

const fs = require('fs');
const path = require('path');

/* подключаем gulp и плагины */
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
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
const TerserPlugin = require("terser-webpack-plugin");

const argv = require('yargs').argv;
const developer = !!argv.developer;
const production = !developer;

const isMode = developer ? 'dev' : 'prod';
const dataMode = require(`./src/data/${isMode}.json`);
const dataSite = require(`./src/data/site.json`);
const versionConfig = {
	'value': '%DT%',
	'append': {
		'key': 'v',
		'to': ['css', 'js'],
	},
};

const webpackConfig = {
	mode: production ? "production" : "development",
	entry: {
		"main.min": "./src/assets/js/index.js",
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	},
	output: {
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /^_(\w+)(\.js)$|node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
		]
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor.min"
				},
			},
		},
		minimize: production,
		minimizer: [
			new TerserPlugin({
        test: /\.js(\?.*)?$/i,
				parallel: true,
        terserOptions: {
          mangle: true,
					sourceMap: !production,
          output: {
            comments: false,
          },
        },
      })
		],
	},
	plugins: []
};

/* пути */
const dirRoot = __dirname;
const dirDist = 'dist';
const dirAssets = 'assets';
const dirSrc = 'src';
const dirStatic = 'static';

const paths = {
	root: path.join(dirRoot, dirDist),
	clean: path.join(dirRoot, dirDist, '*'),
	dist: {
		static: path.join(dirRoot, dirDist),
		html: path.join(dirRoot, dirDist),
		js: path.join(dirRoot, dirDist, dirAssets, 'js'),
		css: path.join(dirRoot, dirDist, dirAssets, 'css'),
		img: path.join(dirRoot, dirDist, dirAssets, 'img'),
		fonts: path.join(dirRoot, dirDist, dirAssets, 'fonts')
	},
	src: {
		static: path.join(dirRoot, dirStatic, '**/*.*'),
		twig: path.join(dirRoot, dirSrc, 'views', '*.twig'),
		script: path.join(dirRoot, dirSrc, dirAssets, 'js', 'index.js'),
		style: path.join(dirRoot, dirSrc, dirAssets, 'scss', 'index.scss'),
		img: path.join(dirRoot, dirSrc, dirAssets, 'img', '**/*.*'),
		fonts: path.join(dirRoot, dirSrc, dirAssets, 'fonts', '**/*.*')
	},
	watch: {
		static: `./${dirStatic}/'**/*.*`,
		twig: `./${dirSrc}/views/**/*.twig`,
		js: `./${dirSrc}/${dirAssets}/js/**/*.js`,
		scss: `./${dirSrc}/${dirAssets}/scss/**/*.scss`,
		img: `./${dirSrc}/${dirAssets}/img/**/*.*`,
		fonts: `./${dirSrc}/${dirAssets}/fonts/**/*.*`
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
	browserSync.init({
		server: {
			baseDir: dirDist,
			index: "index.html"
		}
	});
	browserSync.watch(path.join('.', dirDist, '**/*.*'), browserSync.reload);
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

// js
function scripts() {
	return webpack(webpackConfig)
		.pipe(gulp.dest(paths.dist.js));
}

// fonts
function fonts() {
	return gulp.src(paths.src.fonts)
		.pipe(gulp.dest(paths.dist.fonts));
}

// static
function moveStatic() {
	return gulp.src(paths.src.static)
		.pipe(gulp.dest(paths.dist.static));
}

// обработка картинок
function images() {
	return gulp.src(paths.src.img)
		.pipe(cache(image()))
		.pipe(gulp.dest(paths.dist.img));
}

// создание файла для деплоя
function createDeploy(done) {
	const fileNameDeploy = "deploy.json";
	const successMessage = "Файл deploy.json успешно создан";

	/**
	 * root - путь к папке для выгрузки, относительно корня текущего проекта
	 * hostname - 'логин@адрес' удаленного сервера
	 * destination - путь к папке удаленного сервера, куда выгружать данные
	 * exclude - исключения выгрузки
	 */
	const tmpSetting = {
		root: "dist/assets",
		hostname: "xxx@xxx",
		destination: "~/xxx",
		exclude: ["**/Thumbs.db", "**/*.DS_Store"],
		recursive: true,
		archive: true,
		silent: false,
		compress: true,
	};
	const tmpDeploy = {
		default: 'dev',
		dev: tmpSetting,
		prod: tmpSetting
	};

	fs.writeFileSync(fileNameDeploy, JSON.stringify(tmpDeploy, null, 2));
	console.log(successMessage);
	notifier.notify({ title: 'Создание '+fileNameDeploy, message: successMessage });
	done();
}

// функция для деплоя на сервер
function deployRsync(done) {
	if(!fs.existsSync('./deploy.json')) {
		console.log("Не существует файл deploy.json");
		notifier.notify({ title: "deploy", message: "Не существует файл deploy.json" });
		createDeploy(done);
		return done();
	}
	const deployJson = require('./deploy.json');
	const deployType = typeof argv.deploy === 'string' ? argv.deploy : deployJson.default;
	const deployData = deployJson[deployType];

	if(!deployData) {
		console.log("Не найдены данные для выгрузки");
		notifier.notify({ title: "deploy", message: "Не найдены данные для выгрузки" });
		return done();
	}

	if(deployData.hostname === "xxx@xxx") {
		console.log("Не настроен файл deploy.json");
		notifier.notify({ title: "deploy", message: "Не настроен файл deploy.json" });
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
			notifier.notify({ title: "deploy", message: `Загружено в ${deployData.hostname}:${deployData.destination}` });
		});
}

// инициализируем задачи
exports.moveStatic = moveStatic;
exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.createDeploy = createDeploy;
exports.deploy = deployRsync;
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
