const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	entry: './src/index.ts',
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		client: {
			overlay: false
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new Webpack.ProvidePlugin({
			PIXI: "pixi.js"
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: './assets', to: 'assets' },
				//{ from: './src/assets.yaml', to: 'assets.yaml' },
				{ from: './src/reset.css', to: 'reset.css' }
			]
		}),
		new Webpack.EnvironmentPlugin({
			DEVELOPMENT: true
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			minify: true
		})
	]
};