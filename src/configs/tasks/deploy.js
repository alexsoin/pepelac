import fs from "fs";
import gulp from "gulp";
import rsync from "gulp-rsync";
import confirm from "gulp-confirm";
import yargs from "yargs";

import deployConfig from "../deploy.config";
import paths from "../paths.config";

const { argv } = yargs;

console.log(process.cwd());

/** Создание файла для настройки деплоя */
function deployCreate(done) {
	if (fs.existsSync(paths.deploy.file)) {
		console.log("Файл уже существует");
		return done();
	}
	fs.writeFileSync(paths.deploy.file, JSON.stringify(deployConfig.tmp, null, 2));
	console.log(deployConfig.messages.create.success);

	return done();
}

/** Деплой данных на сервер */
function deploySync(done) {
	if (!fs.existsSync(paths.deploy.file)) {
		console.log(deployConfig.messages.deploy.empty);
		console.log(deployConfig.messages.deploy.startCreateDeploy);
		deployCreate(done);
		console.log(deployConfig.messages.deploy.created);
		return done();
	}
	const deployMode = argv.mode || argv.m || false;
	const deployJson = JSON.parse(fs.readFileSync(paths.deploy.file, "utf8"));
	const deployType = deployMode || deployJson.default;
	const deployData = deployJson[deployType];

	if (deployMode !== deployType) {
		console.log(deployConfig.messages.deploy.startDefault(deployType));
	}

	if (!deployData) {
		console.log(deployConfig.messages.deploy.emptyData(deployType));
		return done();
	}

	if (deployData.hostname === "xxx@xxx") {
		console.log(deployConfig.messages.deploy.errorSettings(deployType));
		return done();
	}

	return gulp.src(deployData.root)
		.pipe(confirm({
			question: `\nВы уверены, что хотите загрузить файлы в \x1b[35m${deployData.hostname}:${deployData.destination}\x1b[0m ? \x1b[37m(y/д)\x1b[0m`,
			proceed(answer) {
				return ["y", "д"].includes(answer.toLowerCase());
			},
		}))
		.pipe(rsync({
			root: deployData.root,
			hostname: deployData.hostname,
			destination: deployData.destination,
			exclude: deployData.exclude,
			recursive: true,
			archive: true,
			silent: false,
			compress: true,
		}))
		.on("end", () => {
			console.log(deployConfig.messages.deploy.end(deployData));
		});
}

export default { deployCreate, deploySync };
