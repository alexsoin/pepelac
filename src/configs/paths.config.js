const path = require('path');
const deployConfig = require('./deploy.config.js');

const dirRoot = process.cwd();
const dirDist = 'dist';
const dirAssets = 'assets';
const dirSrc = 'src';
const dirStatic = 'static';

module.exports = {
	dirs: {
		root: dirRoot,
		dist: dirDist,
		assets: dirAssets,
		srs: dirSrc,
		static: dirStatic,
	},
	deploy: path.join(dirRoot, deployConfig.filename),
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
		bs: path.join(dirRoot, dirDist, '**/*.*'),
		static: `./${dirStatic}/'**/*.*`,
		twig: `./${dirSrc}/views/**/*.twig`,
		js: `./${dirSrc}/${dirAssets}/js/**/*.js`,
		scss: `./${dirSrc}/${dirAssets}/scss/**/*.scss`,
		img: `./${dirSrc}/${dirAssets}/img/**/*.*`,
		fonts: `./${dirSrc}/${dirAssets}/fonts/**/*.*`
	}
};
