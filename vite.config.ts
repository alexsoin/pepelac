import { defineConfig } from "vite";
import vituum from "vituum";
import twig from "@vituum/vite-plugin-twig";
import path from "path";
import fs from "fs";
import dataSite from "./src/data/site";

const filesTwig = fs.readdirSync(path.join(process.cwd(), "src", "views")).filter((i) => i.includes(".twig"));
const filtered = filesTwig.filter((i) => !i.includes("ui.twig"));
const listHtml = filtered.map((i) => {
	const htmlContent = fs.readFileSync(path.join(process.cwd(), "src", "views", i), "utf8");
	const regexResultTitle = htmlContent.match(/{% set title = "([^"]+)" %}/);
	const title = regexResultTitle !== null && regexResultTitle.length > 1 ? regexResultTitle[1] : "";
	const file = i.replace(".vituum.twig", "").replace(".twig", ".html");

	return {title, file};
}).filter((i) => i.file.endsWith(".html"));

const fileNames = (assetInfo) => {
	const fileName = assetInfo.name;
	let extType = assetInfo.name.split(".").pop();
	if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
		extType = "img/site";
	}

	if (/ttf|eot|woff2?/i.test(extType)) {
		extType = "fonts";
	}

	return `assets/${extType}/${fileName}`;
};

export default defineConfig({
	plugins: [
		vituum({
			pages: {
				dir: "./src/views"
			},
			imports: {
				paths: []
			}
		}),
		twig({
			root: "./src",
			globals: {
				site: dataSite,
			},
			functions: {
				listHtml: () => listHtml,
			},
		})
	],
	resolve: {
		alias: {
			"@": path.resolve(process.cwd(), "src"),
		},
	},
	build: {
		manifest: false,
		assetsInlineLimit: 0,
		rollupOptions: {
			input: [
				"./src/views/**/*.{twig,html}",
				"!./src/views/**/*.json"
			],
			output: {
				entryFileNames: "assets/js/[name].js",
				chunkFileNames: "assets/js/[name].js",
				assetFileNames: fileNames,
			},
		},
	},
});
