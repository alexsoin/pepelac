import fs from "fs";
import path from "path";

const dirRoot = process.cwd();
const dirAssets = "assets";
const dirSrc = "src";
const filesTwig = fs.readdirSync(path.join(dirRoot, dirSrc, "views")).filter((i) => i.includes(".twig"));

export default {
	dir: {
		root: dirRoot,
		twig: path.join(dirRoot, dirSrc, "views"),
	},
	file: {
		index: {
			scss: path.join(dirRoot, dirSrc, dirAssets, "scss", "index.scss"),
			js: path.join(dirRoot, dirSrc, dirAssets, "js", "index.js"),
		},
		name: {
			js: "assets/js/[name].min.js?v=[chunkhash]",
			css: "assets/css/main.min.css?v=[chunkhash]",
		},
	},
	list: {
		html: {
			all: filesTwig,
			twigs: filesTwig.map((i) => `${dirRoot}/src/views/${i}`),
			filtered: filesTwig.filter((i) => !i.includes("ui.twig")),
		},
	},
	deploy: {
		file: path.join(dirRoot, "deploy.json"),
	},
};
