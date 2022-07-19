import path from "path";
import fs from "fs";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import paths from "./paths.config";
import devConfig from "./webpack.dev.babel";
import prodConfig from "./webpack.prod.babel";
import dataDev from "../data/dev";
import dataProd from "../data/prod";
import dataSite from "../data/site";
import images from "./helps/all-image";

const dataMode = { production: dataProd, development: dataDev };
const listHtml = paths.list.html.filtered
	.map((i) => {
		const htmlContent = fs.readFileSync(path.join(paths.dir.twig, i), "utf8");
		const title = /{% set title = "([^"]+)"/.exec(htmlContent)[1] || "";
		const url = i.replace(".twig", ".html");

		return { url, title };
	});
const htmlPlugins = paths.list.html.all.map((item) => {
	const name = item.split(".twig")[0];
	return new HtmlWebpackPlugin({
		filename: `${name}.html`,
		template: path.join(paths.dir.twig, `${name}.twig`),
		inject: "body",
	});
});

const commonConfig = (argv) => ({
	devServer: {
		liveReload: true,
		open: true,
		port: 3000,
		client: {
			overlay: {
				errors: true,
				// warnings: false,
			},
			progress: true,
		},
	},
	watchOptions: {
		ignored: /node_modules/,
	},
	stats: {
		assets: true,
		children: false,
		colors: true,
		entrypoints: false,
		hash: false,
		modules: false,
		version: false,
		errorDetails: true,
	},
	entry: [
		...paths.list.html.twigs,
		paths.file.index.js,
		paths.file.index.scss,
	],
	output: {
		clean: true,
		filename: argv.env["path-build"] ? paths.file.name.js.replace("assets/", argv.env["path-build"]).slice(1) : paths.file.name.js,
		publicPath: argv.env["path-build"] ? "" : "/",
		assetModuleFilename: (pathData) => {
			const filepath = path.dirname(pathData.filename).split("/").slice(1).join("/");
			const prePath = filepath.indexOf("assets/") !== 0 ? "assets/libs/" : "";
			const outPath = `${prePath}${filepath}/[name][ext]`.replaceAll("//", "/");

			if (argv.env["path-build"]) {
				return outPath.replace("assets/", argv.env["path-build"]);
			}
			return outPath;
		},
	},
	performance: {
		maxEntrypointSize: Infinity,
		maxAssetSize: Infinity,
	},
	resolve: {
		roots: [
			path.resolve(paths.dir.root, "src"),
		],
		alias: {},
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor",
				},
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /^_(\w+)(\.js)$|node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.twig$/,
				use: [
					{
						loader: "html-loader",
					},
					{
						loader: "twig-html-loader",
						options: {
							data: {
								listHtml,
								mode: dataMode[argv.mode],
								site: dataSite,
								images,
							},
						},
					},
				],
			},
			{
				test: /\.(jpe?g|png|gif|svg|webp|avif|ico)$/i,
				type: "asset/resource",
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		new WebpackBar({
			name: "PEPELAC",
			reporters: ["fancy"],
		}),
		new CopyPlugin({
			patterns: [
				{
					from: "./static", to: argv.env["path-build"] ? `.${argv.env["path-build"]}` : path.resolve(paths.dir.root, "dist"),
				},
			],
		}),
		...htmlPlugins,

		new MiniCssExtractPlugin({
			filename: (argv.env["path-build"] ? paths.file.name.css.replace("assets/", argv.env["path-build"].slice(1)) : paths.file.name.css),
		}),
	],
});

export default (env, argv) => {
	const defaultConfig = commonConfig(argv);
	switch (argv.mode) {
	case "development":
		return merge([defaultConfig, devConfig]);
	case "production":
		return merge([defaultConfig, prodConfig]);
	default:
		throw new Error("No matching configuration was found!");
	}
};
