// const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');
const prodMode = !require('yargs').argv.developer;
const getListJsFiles = (dir) => fs.readdirSync(dir).filter(elem => elem.endsWith('.js')).map(elem => dir + elem);
const paths = {
	vendor: "./src/assets/js/vendor/",	// директория js файлов зависимостей
	main: "./src/assets/js/",						// директория js файлов сайта
};

const config = {
	mode: prodMode ? "production" : "development",
	entry: {
		"vendor.min": getListJsFiles(paths.vendor),
		"main.min": getListJsFiles(paths.main),
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	},
	output: {
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /^_(\w+)(\.js)$|node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
		]
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				test: /\.min\.js$/,
				parallel: true,
				uglifyOptions: {
					output: {
						comments: false
					}
				}
			}),
		],
	},
	plugins: []
};

module.exports = config;
