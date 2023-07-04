import fs from "node:fs";
import path from "node:path";

function getFileTitle(htmlContent) {
	const regexResultTitle = htmlContent.match(/{% set title = ["']([^"]+)["'] %}/);
	return regexResultTitle && regexResultTitle[1] ? regexResultTitle[1] : "";
}

function getFileName(assetInfo) {
	let extType = assetInfo.name.split(".").pop();
	if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
		extType = "img/site";
	}

	if (/ttf|eot|woff2?/i.test(extType)) {
		extType = "fonts";
	}

	return `assets/${extType}/[name][extname]`;
}

const filesTwig = fs.readdirSync(path.join(process.cwd(), "src", "views"))
	.filter((fileName) => fileName.includes(".twig") && !fileName.includes("ui.twig"));

const listHtml = filesTwig
	.map((fileName) => {
		const filePath = path.join(process.cwd(), "src", "views", fileName);
		const htmlContent = fs.readFileSync(filePath, "utf8");
		const title = getFileTitle(htmlContent);
		const file = fileName.replace(".vituum.twig", "").replace(".twig", ".html");
		return { title, file };
	})
	.filter((item) => item.file.endsWith(".html"));

export { listHtml, getFileName };
