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
		"**": {
			target : "http://www.12301.local/",
			secure: false,
			changeOrigin: true
		}
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