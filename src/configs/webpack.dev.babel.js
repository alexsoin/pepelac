import MiniCssExtractPlugin from "mini-css-extract-plugin";
import sass from "sass";
import path from "path";
import paths from "./paths.config";

export default {
	mode: "development",
	devtool: "source-map",
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
						loader: "sass-loader",
						options: {
							implementation: sass,
							sassOptions: {
								includePaths: [
									path.join(paths.dir.root, "node_modules"),
								],
							},
						},
					},
				],
			},
		],
	},
};
