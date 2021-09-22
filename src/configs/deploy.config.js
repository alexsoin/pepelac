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

module.exports = {
	tmp: {
		default: 'dev',
		dev: tmpContent,
		prod: tmpContent
	},
	filename: filename,
	messages: {
		create: {
			title: `Создание ${filename}`,
			success: `Файл ${filename} успешно создан`
		},
		deploy: {
			title: `deploy`,
			empty: `Не существует файл ${filename}`,
			emptyData: "Не найдены данные для выгрузки",
			errorSettings: "Не настроен файл deploy.json",
		}
	}
};
