var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var ip = 'localhost'
var config = require('./webpack.base.config.js')

config.devtool = "#eval-source-map"

config.entry = {
	App1 : [ 'webpack-dev-server/client?http://' + ip + ':3000',
			'webpack/hot/only-dev-server', './djreact/App1', ],
}

config.output.publicPath = 'http://' + ip + ':3000' + '/assets/bundles/local/'

config.plugins = config.plugins.concat([
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new BundleTracker({
			filename : './webpack-stats-local.json'
		}),
		new webpack.DefinePlugin({
			'process.env' : {
				'NODE_ENV' : JSON.stringify('development'),
				'BASE_API_URL' : JSON.stringify('http://' + ip
						+ ':8000/weed/api/'),
			}
		}), new ExtractTextPlugin({
			filename : '[name].css'
		}), ])

// config.module.loaders.push(
// { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel'] }
// )

module.exports = config