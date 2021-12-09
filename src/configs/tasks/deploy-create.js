import fs from "fs";
import notifier from "node-notifier";

import deployConfig from "../deploy.config.js";


/** Создание файла для настройки деплоя */
export default function deployCreate(done) {
	fs.writeFileSync(deployConfig.filename, JSON.stringify(deployConfig.tmp, null, 2));
	console.log(deployConfig.messages.create.success);
	notifier.notify({ title: deployConfig.messages.create.title, message: deployConfig.messages.create.success });

	done();
}
