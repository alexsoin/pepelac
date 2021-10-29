const fs = require('fs');
const gulp = require('gulp');
const twing = require('gulp-twing');
const { TwingEnvironment, TwingLoaderRelativeFilesystem } = require('twing');
const htmlbeautify = require('gulp-html-beautify');
const gulpif = require('gulp-if');
const version = require('gulp-version-number');

const argv = require('yargs').argv;
const developer = !!argv.developer;
const production = !developer;
const isMode = developer ? 'dev' : 'prod';

const dataMode = require(`../../data/${isMode}.json`);
const dataSite = require(`../../data/site.json`);
const versionConfig = require('../version.config.js');
const paths = require('../paths.config.js');


/** Создание html страниц */
exports.templates = function templates() {
	const listHtml = fs.readdirSync(paths.src.listHtml)
		.filter(i => i.includes('.twig') && !i.includes('ui.twig'))
		.map(i => {
			const htmlContent = fs.readFileSync(`${paths.src.listHtml}/${i}`, 'utf8');
			const title = /{% set title = "([^"]+)"/.exec(htmlContent)[1] || '';
			const url = i.replace('.twig', '.html');

			return { url, title };
		});
	const envTwing = new TwingEnvironment(new TwingLoaderRelativeFilesystem(), {
		debug: true,
		cache: false,
		autoescape: false,
	});
	const data = { listHtml, mode: dataMode, site: dataSite };

	return gulp.src(paths.src.twig)
		.pipe(twing(envTwing, data))
		.pipe(gulpif(production, htmlbeautify()))
		.pipe(gulpif(production, version(versionConfig)))
		.pipe(gulp.dest(paths.dist.html));
}
