const gulp = require('gulp');
const webpack = require('webpack-stream');

const webpackConfig = require('../webpack.config.js');
const paths = require('../paths.config.js');


/** Сборка javascript файлов */
exports.scripts = function scripts() {
	return webpack(webpackConfig)
		.pipe(gulp.dest(paths.dist.js));
}
