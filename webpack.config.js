const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
    mode: "production",
    entry: {
        "main": "./src/assets/js/main.js",
        "main.min": "./src/assets/js/main.js",
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