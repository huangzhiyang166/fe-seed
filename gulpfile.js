/**
 * Author: huangzhiyang
 * Date: 2017/1/3 11:20
 * Description: ""
 */
var gulp = require("gulp");
var del = require("del");
var getWebpackConfig = require("./webpack.config.js");
var webpackStream = require('webpack-stream');
var webpack = require("webpack");
var named = require('vinyl-named');
var Path = require("path");
var SRC_DIR = "./src";
var BUILD_DIR = "./build";
var Util = require("./util.js");
var Config = require("./config.js");
var getOutputDir = function(env){
	return {
		develop : "./build/develop",
		test : "./build/test",
		release : "./build/release",
		production : "./build/production"
	}[env];
};
var upload = function(env){
	var js_filename = `/${env}/js/${Config.output.filename}.js`;
	var css_filename = `/${env}/css/${Config.output.filename}.css`;
	Util.upload({
		file : BUILD_DIR + js_filename,
		host : env,
		remotePath : "/js"
	})
	Util.upload({
		file : BUILD_DIR + css_filename,
		host : env,
		remotePath : "/css"
	})
}

var Compile = function(env){
	var output = getOutputDir(env);
	var webpackConfig = getWebpackConfig(env);
	return gulp.src(Config.entry)
		.pipe(named(function(file){
			return "js/"+Config.output.filename;
		}))
		.pipe(webpackStream(webpackConfig))
		.pipe(gulp.dest(output))
		.on('end', function(){
			console.log("compile finish");
			//if(env!=="develop") upload(env);
		});
};


gulp.task("test",function(){
	del("./build/test");
	Compile("test");
})
gulp.task("release",function(){
	del("./build/release");
	Compile("release");
})
gulp.task("production",function(){
	del("./build/production");
	Compile("production");
})