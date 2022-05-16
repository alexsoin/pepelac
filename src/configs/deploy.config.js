/**
 * root - путь к папке для выгрузки, относительно корня текущего проекта
 * hostname - 'логин@адрес' удаленного сервера
 * destination - путь к папке удаленного сервера, куда выгружать данные
 * exclude - исключения выгрузки
 */
const tmpContent = {
	root: "dist/assets",
	hostname: "xxx@xxx",
	destination: "~/xxx",
	exclude: ["**/Thumbs.db", "**/*.DS_Store"],
	recursive: true,
	archive: true,
	silent: false,
	compress: true,
};

/** Имя файла деплоя */
const filename = "deploy.json";

function info(val) {
	const ico = "<i>";
	return `\x1b[34m${ico} \x1b[0m${val}`;
}
function warn(val) {
	const ico = "<i>";
	return `\x1b[33m${ico} \x1b[0m${val}`;
}

function error(val) {
	const ico = "<!>";
	return `\x1b[31m${ico} ${val}\x1b[0m`;
}

function success(val) {
	return `\x1b[32m\n--- ${val} ---\n\x1b[0m`;
}

export default {
	tmp: {
		default: "dev",
		dev: tmpContent,
		prod: tmpContent,
	},
	filename,
	messages: {
		create: {
			title: `Создание ${filename}`,
			success: info(`Файл ${filename} успешно создан`),
		},
		deploy: {
			title: "deploy",
			startCreateDeploy: info(`Запущен автоматический процесс создания файла ${filename}`),
			created: info(`Настройте файл синхронизации "${filename}" и запустите команду повторно`),
			end: (deployData) => success(`Загружено в \x1b[35m${deployData.hostname}:${deployData.destination}\x1b[32m`),
			startDefault: (mode) => info(`Запущена выгрузка с "default" значением "${mode}"`),
			empty: warn(`Не существует файл ${filename}`),
			emptyData: (mode) => error(`Не найдена настройка для режима "${mode}". Проверьте, что объект "${mode}" правильно настроен в конфиге "${filename}"`),
			errorSettings: (mode) => error(`Неверно настроен файл "${filename}" для режима "${mode}"`),
		},
	},
};
