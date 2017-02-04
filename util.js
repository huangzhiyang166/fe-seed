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
	 * 下载指定文件到本地
	 * @param opt
	 * opt.src      目标文件地址                                      必填
	 * opt.output   将下载成功后的文件要放到哪个路径下，包括路径及文件命名  必填
	 * opt.encoding 文件字符编码                                      可选
	 * callback     下载完成时的回调                                   可选
	 */
	download : function(opt){
		var src = opt.src;
		if(!src) throw new Error("缺少下载地址");
		var output = opt.output;
		if(!output) throw new Error("缺少文件存放地址");
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
	 * 上传指定文件到指定服务器
	 * @param opt
	 * opt.file          待上传文件src         必填
	 * opt.host         远程主机地址          必填
	 * opt.port         端口号               可选   默认22
	 * opt.user         登录远程主机的用户名   必填
	 * opt.password     登录远程主机的密码     必填
	 * opt.remotePath   远程主机的哪个目录下   可选   默认 "./"
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