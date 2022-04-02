import fs from 'fs';
import gulp from "gulp";
import twing from "gulp-twing";
import { TwingEnvironment, TwingLoaderRelativeFilesystem } from "twing";
import htmlbeautify from "gulp-html-beautify";
import gulpif from "gulp-if";
import version from "gulp-version-number";
import yargs from "yargs";

import versionConfig from "../version.config.js";
import paths from "../paths.config.js";


const { argv } = yargs;
const dataSite = JSON.parse(fs.readFileSync(`${paths.src.data}/site.json`));
const developer = !!argv.developer;
const production = !developer;
const isMode = developer ? 'dev' : 'prod';
const dataMode = JSON.parse(fs.readFileSync(`${paths.src.data}/${isMode}.json`));

/** Создание html страниц */
export default function templates() {
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
		.pipe(gulpif(production, htmlbeautify({
			"indent_with_tabs": true,
		})))
		.pipe(gulpif(production, version(versionConfig)))
		.pipe(gulp.dest(paths.dist.html));
}
