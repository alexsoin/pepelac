import fs from 'node:fs';
import path from 'node:path';

function getFileName(assetInfo) {
	let extType = assetInfo.name.split('.').pop();
	if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
		extType = 'img/site';
	}

	if (/ttf|eot|woff2?/i.test(extType)) {
		extType = 'fonts';
	}

	return `assets/${extType}/[name][extname]`;
}

function getFilesWithExtension(dir, extension) {
	let results = [];
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			results = results.concat(getFilesWithExtension(filePath, extension));
		} else if (path.extname(file) === extension) {
			results.push(filePath);
		}
	}

	return results;
}

function extractTitleFromTwig(fileContent) {
	const titleRegex = /\{% set title = ["'](.+?)["'] %\}/;
	const match = fileContent.match(titleRegex);
	return match ? match[1] : null;
}

function getTwigFilesWithTitles(directory) {
	const twigFiles = getFilesWithExtension(directory, '.twig');
	return twigFiles
		.filter(file => path.basename(file) !== 'ui.twig')
		.map(file => {
			const content = fs.readFileSync(file, 'utf8');
			const title = extractTitleFromTwig(content) || '';
			return {
				file: path.relative(directory, file).replace('.twig', '.html'),
				title,
			};
		});
}

const listHtml = getTwigFilesWithTitles(path.join(process.cwd(), 'src', 'views'));

export { listHtml, getFileName };
