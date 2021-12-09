import gulp from "gulp";
import bserver from "browser-sync";

import paths from "./src/configs/paths.config.js";
import clean from "./src/configs/tasks/clean.js";
import moveStatic from "./src/configs/tasks/move-static.js";
import templates from "./src/configs/tasks/templates.js";
import styles from "./src/configs/tasks/styles.js";
import scripts from "./src/configs/tasks/scripts.js";
import fonts from "./src/configs/tasks/fonts.js";
import images from "./src/configs/tasks/images.js";
import deployCreate from "./src/configs/tasks/deploy-create.js";
import deployRsync from "./src/configs/tasks/deploy-rsync.js";


const browserSync = bserver.create();

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
export { moveStatic, templates, styles, scripts, fonts, images, deployCreate, deployRsync, clean };

export const build = gulp.series(
	clean,
	gulp.parallel(moveStatic, fonts, images, styles, scripts, templates)
)

export default gulp.series(
	clean,
	gulp.parallel(moveStatic, fonts, images, styles, scripts, templates),
	gulp.parallel(watch, server)
)
