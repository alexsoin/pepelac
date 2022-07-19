import fs from "fs";
import path from "path";
import paths from "../paths.config";

const readdirSync = (p, a = []) => {
	if (fs.statSync(p).isDirectory()) fs.readdirSync(p).map((f) => readdirSync(a[a.push(path.join(p, f)) - 1], a));
	return a;
};

const images = readdirSync(path.join(paths.dir.root, "src", "assets", "img")).filter((i) => i.match(/\.([0-9a-z]+)(?:[?#]|$)/i)).map((i) => i.replace(path.join(paths.dir.root, "src"), ""));

export default images;
