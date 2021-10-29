const fs = require('fs');
const gulp = require('gulp');
const notifier = require('node-notifier');
const rsync = require('gulp-rsync');
const confirm = require('gulp-confirm');

const deployConfig = require('../deploy.config.js');
const paths = require('../paths.config.js');


/** Деплой данных на сервер */
exports.deployRsync = function deployRsync(done) {
	if(!fs.existsSync(paths.deploy)) {
		console.log(deployConfig.messages.deploy.empty);
		notifier.notify({ title: deployConfig.messages.deploy.title, message: deployConfig.messages.deploy.empty });
		createDeploy(done);
		return done();
	}
	const deployJson = require(paths.deploy);
	const deployType = typeof argv.deploy === 'string' ? argv.deploy : deployJson.default;
	const deployData = deployJson[deployType];

	if(!deployData) {
		console.log(deployConfig.messages.deploy.emptyData);
		notifier.notify({ title: deployConfig.messages.deploy.title, message: deployConfig.messages.deploy.emptyData});
		return done();
	}

	if(deployData.hostname === "xxx@xxx") {
		console.log(deployConfig.messages.deploy.errorSettings);
		notifier.notify({ title: deployConfig.messages.deploy.title, message: deployConfig.messages.deploy.errorSettings });
		return done();
	}

	return gulp.src(deployData.root)
		.pipe(confirm({
			question: `Вы уверены, что хотите загрузить файлы в ${deployData.hostname}:${deployData.destination}? (y/Y)`,
			input: '_key:y,Y'
		}))
		.pipe(rsync({
			root: deployData.root,
			hostname: deployData.hostname,
			destination: deployData.destination,
			exclude: deployData.exclude,
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
		.on('end', function(){
			console.log(`Загружено в ${deployData.hostname}:${deployData.destination}`);
			notifier.notify({ title: deployConfig.messages.deploy.title, message: `Загружено в ${deployData.hostname}:${deployData.destination}` });
		});
}
