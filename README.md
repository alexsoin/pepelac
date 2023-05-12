![template engine - twig](https://img.shields.io/static/v1?label=template&message=twig&color=%2300A95C&style=for-the-badge)
![node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

# PEPELAC - frontend boilerplate

![logo](https://user-images.githubusercontent.com/3787132/176785257-2fa84f95-acc2-4ecb-a5af-df0efaf571d3.svg)

PEPELAC - Современный инструментарий для вёрстки и создания статичных сайтов.

## Требования к окружению

- node.js
- git

## Установка

### 1. Клонирование и инициализация

Скачайте файлы с github или клонируйте его c помощью команды:

```bash
git clone https://github.com/alexsoin/pepelac.git
```

Инициализация проекта(Работает только в UNIX системах)

```bash
./init
```

### 2. Установки зависимостей проекта

Для установки зависимостей проекта необходимо в командной строке ввести команды:

```bash
npm i
```

Если требуются дополнительные пакеты, то для их установки нужно выполнить команду:

- Установка пакета, при этом информация о нём, автоматически прописывается в секцию "devDependencies" файла "
  package.json"

```bash
npm i -D название_пакета
```

- Установка пакета, при этом информация о нём, автоматически прописывается в секцию "dependencies" файла "package.json"

```bash
npm i название_пакета
```

### 3. Правка информации о новом проекте

1. Переходим в клонированную директорию
2. Удаляем папку `.git`

## Как использовать окружение

- `npm run dev` - запуск live-server
- `npm run build` - сборка проекта

### Деплой собранных файлов на сервер

- `npm run deploy` - Деплой собранных файлов на сервер, указанный как **default** в файле deploy.json
- `npm run deploy:dev` - Деплой собранных файлов на сервер, указанный как **dev** в файле deploy.json
- `npm run deploy:prod` - Деплой собранных файлов на сервер, указанный как **prod** в файле deploy.json

## Список инструментов

Окружение, предназначенное для разработки фронтенд проекта, построено на базе следующих инструментов:

- **node.js** (среды, в которой будет выполняться окружение);
- **npm** (пакетного менеджера, входящего в Node.js; будет использоваться для загрузки Gulp, плагинов и фронтенд
  пакетов);
- **popover, bootstrap** (пакеты, которые будут использоваться для сборки css и js частей сайта);

## Файловая структура Gulp проекта

### Корневая директория

В корне проекта расположены папки:

```bash
├── init                              # Инициализатор проекта
├── deploy.json                       # Конфигурация для деплоя проекта
├── src/                              # Исходники
│   ├── assets/                       # Общий каталог хранения скриптов, стилей, шрифтов и изображений
│   │   ├── fonts/                    # Шрифты
│   │   ├── img/                      # Изображения
│   │   ├── js/                       # js-файлы
│   │   │   └── index.js              # Точка входа js файлов
│   │   └── scss/                     # scss стили
│   │       ├── base.scss             # Пользовательские стили
│   │       ├── fonts.scss            # Подключение шрифтов
│   │       ├── index.scss            # Точка входа scss файлов
│   │       └── variables.scss        # Переменные стилей
│   ├── data/                         # Массивы данных для вывода значений при разработке
│   │   └── site.js                   # Файл для вывода данных
│   └── views/                        # twig файлы, которые затем преобразуются в html
│       ├── 404.twig                  # Страница ошибки 404
│       ├── index.twig                # Главная страница
│       ├── kit.twig                  # Типографика
│       ├── layout/                   # Шаблоны страниц
│       ├── partials/                 # Подключаемые куски кода
│       └── ui.twig                   # Список страниц сайта
└── static/                           # Статичные файлы, которые будут просто перенесены в dist
```

### Директория `src/assets/js/`

В папке `js` находится файл `index.js`, который является входной точкой для js файлов.

При сборке проекта, все импорты внешних зависимостей(таких как boostrap) будут собираться в файл `vendor.min.js`, а
пользовательские скрипты будут собираться в файл `main.min.js`. Эти файлы после успешной сборки будут находиться в
директории `dist/assets/js/`.

### Директория `src/assets/scss/`

Папка `scss` отведена под стили. В данной директории находятся следующие файлы:

- `index.scss` - импорты файлов, содержимое которых необходимо включить в итоговый файл стилей
- `base.scss` - используется для написания своих стилей
- `variables.scss` - содержит SCSS переменные, с помощью которых будем изменять стили bootstrap, а также использовать
  его для создания своих переменных
- `fonts.scss` - подключаются шрифты, используемые на сайте
- `helpers/bootstrap.scss` - подключаются boostrap зависимости

### Директория `src/assets/views/`

В данной сборке используется шаблонизатор twig.

Файл `index.twig` - это главная страница создаваемого проекта. Кроме `index.twig` в данную директорию можно поместить и
другие twig файлы из которых будут созданы html страницы.

В папке `layout` находятся шаблоны страниц.

В папке `partials` находятся фрагменты страниц. Это позволит более просто создавать и редактировать html страницы, т.к.
отдельные части страниц уже будут находиться в специальных файлах.

Чтобы при показе результата сборки не приходилось сбрасывать кеш браузера изза устаревших стилей в данной сборке
присутствует версионирование. При запуске команды `build` в html файлах у подключаемых js и css добавляется их версия.

---

<p align="center">
  <a href="https://vituum.dev/" target="_blank" rel="noopener noreferrer">
    <img width="60" src="https://avatars.githubusercontent.com/u/109584961" alt="Logo vituum">
  </a>
</p>
<p align="center">powered by <a href="https://vituum.dev/" target="_blank" rel="noopener noreferrer">vituum</a></p>
