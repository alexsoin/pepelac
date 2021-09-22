const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const paths = require('./src/configs/paths.config.js');
const {
	moveStatic,
	templates,
	styles,
	scripts,
	fonts,
	images,
	createDeploy,
	deployRsync,
	clean
} = require('./src/configs/tasks.config.js');

exports.moveStatic = moveStatic;
exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.createDeploy = createDeploy;
exports.deploy = deployRsync;
exports.clean = clean;

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
			baseDir: paths.dirs.dist,
			index: "index.html"
		}
	});
	browserSync.watch(paths.watch.bs, browserSync.reload);
}

/** Задачи */
gulp.task('default', gulp.series(
	clean,
	gulp.parallel(moveStatic, fonts, images, styles, scripts, templates),
	gulp.parallel(watch, server)
));

gulp.task('build', gulp.series(
	clean,
	gulp.parallel(moveStatic, fonts, images, styles, scripts, templates)
));
