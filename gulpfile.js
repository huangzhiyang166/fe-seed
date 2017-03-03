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
var upload = function(env,type){
	var js_filename = `/${env}/js/${Config.output.filename}.js`;
	var css_filename = `/${env}/css/${Config.output.filename}.css`;
	if(!type){
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
	}else if(type=="js"){
		Util.upload({
			file : BUILD_DIR + js_filename,
			host : env,
			remotePath : "/js"
		})
	}else if(type=="css"){
		Util.upload({
			file : BUILD_DIR + css_filename,
			host : env,
			remotePath : "/css"
		})
	}
}

var Compile = function(env){
	var envArr = env.split(":");
	env = env[0];
	var type = envArr[1];
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
			if(env!=="develop") upload(env,type);
		});
};


gulp.task("test",function(){
	del("./build/test");
	Compile("test");
})
gulp.task("test:css",function(){
	del("./build/test/css");
	Compile("test:css");
})
gulp.task("test:js",function(){
	del("./build/test/js");
	Compile("test:js");
})


gulp.task("release",function(){
	del("./build/release");
	Compile("release");
})
gulp.task("release:css",function(){
	del("./build/release/css");
	Compile("release:css");
})

gulp.task("release:js",function(){
	del("./build/release/js");
	Compile("release:js");
})



gulp.task("production",function(){
	del("./build/production");
	Compile("production");
})
gulp.task("production:css",function(){
	del("./build/production/css");
	Compile("production:css");
})
gulp.task("production",function(){
	del("./build/production/js");
	Compile("production:js");
})