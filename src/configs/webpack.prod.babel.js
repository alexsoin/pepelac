import BeautifyHtmlWebpackPlugin from "@sumotto/beautify-html-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import sass from "sass";
import path from "path";
import paths from "./paths.config";

export default {
	mode: "production",
	devtool: false,
	module: {
		rules: [
			{
				test: /\.(scss|sass|css)$/i,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							url: true,
							import: true,
						},
					},
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									["autoprefixer"],
								],
							},
						},
					},
					{
						loader: "sass-loader",
						options: {
							implementation: sass,
							sassOptions: {
								includePaths: [path.join(paths.dir.root, "node_modules")],
							},
						},
					},
				],
			},
		],
	},
	plugins: [
		new BeautifyHtmlWebpackPlugin({
			indent_size: 2,
			indent_with_tabs: true,
		}),
	],
	optimization: {
		minimizer: [
			new CssMinimizerPlugin({
				minimizerOptions: {
					preset: [
						"default",
						{
							discardComments: { removeAll: true },
						},
					],
				},
			}),
			new TerserPlugin({
				test: /\.js(\?.*)?$/i,
				parallel: true,
				terserOptions: {
					mangle: true,
					output: {
						comments: false,
					},
				},
			}),
			new ImageMinimizerPlugin({
				generator: [
					{
						preset: "webp",
						implementation: ImageMinimizerPlugin.squooshGenerate,
						options: {
							encodeOptions: {
								webp: {
									quality: 90,
								},
							},
						},
					},
					{
						preset: "avif",
						implementation: ImageMinimizerPlugin.squooshGenerate,
						options: {
							encodeOptions: {
								avif: {
									cqLevel: 33,
								},
							},
						},
					},
				],
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminGenerate,
					options: {
						plugins: [
							"imagemin-gifsicle",
							"imagemin-mozjpeg",
							"imagemin-pngquant",
							"imagemin-svgo",
						],
					},
				},
			}),
		],
	},
};
