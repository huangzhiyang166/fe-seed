module.exports = {
	entry : "./src/index.js",
	output : {
		filename : "bundle.all"
	},
	htmlTemplate : {
		title : "app",
		filename : "index.html",
		template : "./src/index.html",
		inject : true,
		hash : false
	},
	proxy : {
		"/r/*": {
			target : "http://localhost:8001/",
			secure: false,
			changeOrigin: false
		}
	},
	mockServer : {
		port : "8001",
		watch : true,
		delay : 800
	},
	sftp : {
		test : {
			username : "",
			password : ""
		},
		release : {
			username : "",
			password : ""
		},
		production : {
			username : "",
			password : ""
		}
	}
}