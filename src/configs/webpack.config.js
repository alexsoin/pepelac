const TerserPlugin = require("terser-webpack-plugin");
const argv = require('yargs').argv;
const developer = !!argv.developer;
const production = !developer;

module.exports = {
	mode: production ? "production" : "development",
	entry: {
		"main.min": "./src/assets/js/index.js",
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
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor.min"
				},
			},
		},
		minimize: production,
		minimizer: [
			new TerserPlugin({
        test: /\.js(\?.*)?$/i,
				parallel: true,
        terserOptions: {
          mangle: true,
					sourceMap: !production,
          output: {
            comments: false,
          },
        },
      })
		],
	},
	plugins: []
};
