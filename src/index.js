require("./index.scss");
var AdaptApi = function(api){
	return api;
	return location.hostname=="localhost" ? ("/api" + api) : api;
};
var Main = {
	init : function(){
		
		PFT.Util.Ajax("/r/Home_HomeMember/getMemberInfo/",{
			loading : function(){
				console.log("loading...");
			},
			complete : function(){
				console.log("complete...");
			},
			success : function(res){
				console.log(res);
			},
			serverError : function(text){
				console.log(text)
			}
		})


	}
};

Main.init();