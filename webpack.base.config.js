var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
	filename : "[name].[contenthash].css",
// disable : process.env.NODE_ENV !== "development"
});
module.exports = {
	context : __dirname,

	entry : {
		// Add as many entry points as you have container-react-components here
		App1 : './reactjs/App1',
		vendors : [ 'react' ],
	},

	output : {
		path : path.resolve('./djreact/assets/bundles/local/'),
		filename : "[name]-[hash].js"
	},

	externals : [], // add all vendor libs

	module : {
		rules : [ {
			test : /\.(js|jsx)$/,
			exclude : /(node_modules|bower_components)/,
			use : {
				loader : 'babel-loader',
				options : {
					presets : [ 'babel-preset-env', 'babel-preset-es2015' ],
					plugins : [ 'babel-plugin-transform-class-properties' ]
				}

			}

		}, {
			test : /\.(css|scss)$/,
			use : extractSass.extract({
				use : [ {
					loader : "css-loader"
				}, {
					loader : "sass-loader"
				} ],
				// use style-loader in development
				fallback : "style-loader"
			})
		} ],
	// add all common loaders here
	},

	plugins : [ new webpack.optimize.CommonsChunkPlugin({
		name : 'vendors',
		filename : 'vendors.bundle.js'
	}), ], // add all common plugins here
	resolve : {
		// modulesDirectories : [ 'node_modules', 'bower_components' ],
		extensions : [ '.js', '.jsx' ]
	},
}
console.log(module.exports.output.path);