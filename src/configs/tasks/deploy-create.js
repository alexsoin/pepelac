const fs = require('fs');
const notifier = require('node-notifier');

const deployConfig = require('../deploy.config.js');


/** Создание файла для настройки деплоя */
exports.deployCreate = function deployCreate(done) {
	fs.writeFileSync(deployConfig.filename, JSON.stringify(deployConfig.tmp, null, 2));
	console.log(deployConfig.messages.create.success);
	notifier.notify({ title: deployConfig.messages.create.title, message: deployConfig.messages.create.success });

	done();
}
