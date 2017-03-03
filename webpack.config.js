var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Path = require("path");
var autoprefixer = require("autoprefixer");
var precss = require("precss");
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Config = require("./config.js");

module.exports = function(env){

	var getPlugins = function(env,cssname){
		var plugins = [];
		var filename = cssname ? (cssname+".css") : Config.output.filename + ".css";
		plugins.push(new ExtractTextPlugin("css/"+filename));
		if(env=="production" || env=="release"){
			plugins.push(new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings : false
				},
				sourceMap : false
			}))
		}


		var htmlTemplateConfig = Config.htmlTemplate;
		plugins.push(new HtmlWebpackPlugin({
	      	title: htmlTemplateConfig.title,
	      	filename : htmlTemplateConfig.filename,
	      	template : htmlTemplateConfig.template,
	      	inject : htmlTemplateConfig.inject,
	      	hash : htmlTemplateConfig.hash
	    }))
		return plugins;
	}



	var __Config = {
		debug : true,
		module : {
			loaders : [{
				test : /\.html|tpl|xtpl$/,
				loader : "html?-minimize"
			},{
				test : /\.css$/,
				loader : ExtractTextPlugin.extract("style","css?sourceMap!cssnext!postcss")
			},{
				test : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,loader : 'file-loader'
			},{
				test : /\.(png|jpe?g|gif)$/,loader : 'url-loader?limit=8192&name=images/[name]-[hash].[ext]'
			},{
				test: /\.json$/,
				loader: 'json'
			}]
		},
		postcss : function(){
			return [precss, autoprefixer];
		},
		plugins : getPlugins(env),
		externals: [],
		resolve : {
			alias : {
				
			}
		},
		devtool : "#source-map"
	};


	if(env=="develop"){
		__Config["entry"] = Config.entry;
		__Config["output"] = {};
		__Config["output"]["path"] = "/build/develop/js";
		__Config["output"]["filename"] = Config.output.filename;
		__Config["devServer"] = {
			inline : true,
			contentBase: "./build/develop",
			// hot: true,
			// compress: true,

			proxy: Config.proxy,

			setup: function(app) {
			    
			},

			staticOptions: {},
			quiet: false,
			noInfo: false,
			// lazy: true,
			// filename: "bundle.js",
		 	// watchOptions: {
			//     aggregateTimeout: 300,
			//     poll: 1000
		 	// },
			// publicPath: "./build/develop",
			headers: { "X-Custom-Header": "yes" },
			stats: { colors: true }
		}
	}

	// console.log(__Config);

	return __Config;


}