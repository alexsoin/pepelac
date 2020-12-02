const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');

const scriptsDir = "./src/assets/js/";          // директория js файлов сайта
const vendorDir = "./src/assets/js/vendor/";    // директория js файлов зависимостей

const scripts = fs.readdirSync(scriptsDir).filter(elem => elem.endsWith('.js')).map(elem => scriptsDir + elem);
const vendor = fs.readdirSync(vendorDir).filter(elem => elem.endsWith('.js')).map(elem => vendorDir + elem);

const config = {
    mode: "production",
    entry: {
        "vendor.min": vendor,
        "main.min": scripts,
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
            }
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