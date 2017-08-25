/**
 * Author: huangzhiyang
 * Date: 2017/1/9 12:27
 * Description: ""
 */

var fs = require("fs");
var request = require("request");
var gulp = require("gulp");
var sftp = require("gulp-sftp");
var hostConfig = require("./config.js").sftp;
var path = require("path");

var Util = {
	/**
	 * 下载文件
	 * @param opt
	 * opt.src      目标文件src地址                                  
	 * opt.output	下载到哪个目录下
	 * opt.encoding 指定文件有encoding
	 * callback     完成时回调
	 */
	download : function(opt){
		var src = opt.src;
		if(!src) throw new Error("missing src");
		var output = opt.output;
		if(!output) throw new Error("missing output");
		var callback = opt.callback || function(){};
		var encoding = opt.encoding || "utf8";
		request(src,function(err,res,body){
			var body = res.body;
			var out = fs.createWriteStream(output,{encoding:encoding});
			out.write(body);
			out.end();
			callback(err,res,body);
		});
	},
	/**
	 * 上传指定文件到指定远程目录
	 * @param opt
	 * opt.file         目标文件在硬盘上的地址
	 * opt.host         远程服务器host
	 * opt.port         端口
	 * opt.user         登录用户名
	 * opt.password     密码
	 * opt.remotePath   要上传至远程服务器的哪个目录
	 */
	upload : function(opt){

		var root = process.cwd();

		var file = opt.file;
		var host = opt.host;
		var env = opt.host;
		var port = opt.port || 22;
		var user = opt.user;
		var password = opt.password;
		var remotePath = opt.remotePath;
		var __Host = {
			test : {
				host : "192.168.20.138",
				remotePath : "/var/www/static/assets/build",
				username : hostConfig.test.username,
				password : hostConfig.test.password
			},

			release : {
				host : "121.43.119.39",
				remotePath : "/data/static_dev/assets/build",
				username : hostConfig.release.username,
				password : hostConfig.release.password
			},

			production : {
				host : "121.40.69.184",
				remotePath : "/databak/www/static/assets/build",
				username : hostConfig.production.username,
				password : hostConfig.production.password
			},

			image : {
				host : "121.40.69.184",
				remotePath : "/databak/www/static/assets/build/images",
				username : hostConfig.production.username,
				password : hostConfig.production.password
			},

			iconfont : {
				host : "121.40.69.184",
				remotePath : "/databak/www/static/assets/build/iconfont",
				username : hostConfig.production.username,
				password : hostConfig.production.password
			},

			lib : {
				host : "121.40.69.184",
				remotePath : "/databak/www/static/assets/build/lib",
				username : hostConfig.production.username,
				password : hostConfig.production.password
			}
		};


		var Host = __Host[host];

		if(Host){
			user = __Host[host]["username"];
			password = __Host[host]["password"];
			host = Host.host;
			remotePath = path.join(Host.remotePath,remotePath);
		}

		gulp.src(path.join(root,file)).pipe(sftp({
			host: host,
			user: user,
			port: port,
			password: password,
			remotePath: remotePath
		}))
	}
};




module.exports = Util;