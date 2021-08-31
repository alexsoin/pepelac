# Gulp + Webpack starter kit - Окружение для разработки веб-проектов

Современный стартовый инструментарий для веб-разработки с использованием Gulp Task Runner и Webpack bundler.

Все задачи выполняются через Gulp. Webpack используется только для сборки Javascript.

![](src/assets/img/gwst.png)

## Требования к окружению

- node.js
- git

## Установка

### 1. Клонирование и инициализация

Скачайте файлы с github или клонируйте его c помощью команды:

```bash
git clone https://github.com/alexsoin/gw-starter-kit.git
```

Инициализация проекта(Работает только в UNIX системах)

```bash
./init
```

### 2. Установки зависимостей проекта

Для установки зависимостей проекта необходимо в командной строке ввести команды:

```bash
npm install
```

Если требуются дополнительные пакеты, то для их установки нужно выполнить команду:

- Установка пакета, при этом информация о нём, автоматически прописывается в секцию "devDependencies" файла "package.json" _(такие пакеты как gulp-autoprefixer)_

```bash
npm install --save-dev название_пакета
```

- Установка пакета, при этом информация о нём, автоматически прописывается в секцию "dependencies" файла "package.json" _(такие пакеты как bootstrap)_

```bash
npm install --save-prod название_пакета
```

### 3. Правка информации о новом проекте

1. Переходим в клонированную директорию
2. Удаляем папку `.git`
3. Редактируем файл `package.json`, меняем в нем параметры `name`, `description`, `author` и `repository.url` на свои значения.

## Как использовать окружение

**Режим живого сервера**

- `npm run watch` - сборка и запуск live-server в режиме developer
- `npm run prodwatch` - сборка и запуск live-server в режиме production

**Режим сборки**

- `npm run build` - сборка проекта в режиме production
- `npm run devbuild` - сборка проекта в режиме developer

**Выборочная сборка**:

- `gulp templates` - сборка html файлов
- `gulp styles` - сборка css стилей
- `gulp scripts` - сборка js скриптов
- `gulp fonts` - сборка шрифтов
- `gulp images` - сборка картинок
- `gulp clean` - очистка папки конечной сборки

## Список инструментов

Окружение, предназначенное для разработки фронтенд проекта, построено на базе следующих инструментов:

- **node.js** (среды, в которой будет выполняться окружение);
- **npm** (пакетного менеджера, входящего в Node.js; будет использоваться для загрузки Gulp, плагинов и фронтенд пакетов);
- **popover, bootstrap** (пакеты, которые будут использоваться для сборки css и js частей сайта);
- **gulp и его плагины** (будут использоваться для сборки проекта и выполнения других веб задач).
- **webpack и его плагины** (будут использоваться для сборки js скриптов).

## Файловая структура Gulp проекта

### Корневая директория

В корне проекта расположены папки:

```bash
├── deploy.json-example
├── gulpfile.js                 # Конфигурация и задачи Gulpfile
├── init                        # Инициализатор проекта
├── dist/                       # Папка выгрузки проекта
├── src/                        # Исходники
│   ├── assets/                 # Хранятся стили, скрипты и тд
│   │   ├── fonts/              # Шрифтов
│   │   ├── img/                # Изображения
│   │   ├── js/                 # js-файлов
│   │   │   └── index.js        # Точка входа js файлов
│   │   └── scss/               # scss стили
│   │       ├── base.scss       # Пользовательские стили
│   │       ├── _bootstrap.scss # Подключение bootstrap стилей
│   │       ├── fonts.scss      # Подключение шрифтов
│   │       ├── index.scss      # Точка входа scss файлов
│   │       └── variables.scss  # Переменные стилей
│   ├── data/                   # json файлы для вывода данных при разработке
│   │   ├── dev.json            # Вывод данных при develop разработке
│   │   ├── prod.json           # Вывод данных при production разработке
│   │   └── site.json           # Общий файл для вывода данных
│   └── views/									# Для фрагментов twig файлов
│       ├── index.twig					# index.twig будет преобразован в index.html страницу
│       ├── layout/							# Шаблоны страницы
│       │   └── base.twig				# Базовый шаблон
│       └── partials/						# Части часто используемого кода на страницах
│           └── header.twig			# header
├── static/											# Статичные файлы, которые будут просто перенесены в dist
│   └── favicon.ico							# favicon
└── webpack.config.js						# Настройки webpack
```

### Директория js

В папке `js` находится файл `index.js`, который является входной точкой для js файлов.

При сборке проекта, все импорты внешних зависимостей(таких как boostrap) будут собираться в файл `vendor.min.js`, а пользовательские скрипты будут собираться в файл `main.min.js`. Эти файлы после успешной сборки будут находиться в директории `dist/assets/js/`.

### Директория scss

Папка `scss` отведена под стили. В данной директории находятся следующие файлы:

- `index.scss` - импорты файлов, содержимое которых необходимо включить в итоговый файл стилей
- `base.scss` - используется для написания своих стилей
- `variables.scss` - содержит SCSS переменные, с помощью которых будем изменять стили bootstrap, а также использовать его для создания своих переменных
- `fonts.scss` - подключаются шрифты, используемые на сайте
- `_bootstrap.scss` - подключаются boostrap зависимости

### Директория views и файл index.twig

В данной сборке используется шаблонизатор twig.

Файл `index.twig` - это главная страница создаваемого проекта. Кроме `index.twig` в данную директорию можно поместить и другие twig файлы из которых будут созданы html страницы.

Директория `layout` предназначена для шаблонов страниц.

Директория `partials` предназначена для фрагментов страниц. Это позволит более просто создавать и редактировать html страницы, т.к. отдельные части страниц уже будут находиться в специальных файлах.

Чтобы при показе результата сборки не приходилось сбрасывать кеш браузера изза устаревших стилей в данной сборке присутствует версионирование. При запуске команды `build` в html файлах у подключаемых js и css добавляется их версия.
