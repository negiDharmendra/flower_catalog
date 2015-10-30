var http = require('http');
var fs = require('fs');
var querysString = require("querystring")
function requestHandler(req,res){
	var requestData='';
	var myFiles = [
		"./html/abeliophyllum.html", "./html/ageratum.html", "./html/guest_book.html",
		 "./html/index.html","./css/abeliophyllum_info.css", "./css/ageratum_info.css",
		 "./css/index.css","./css/guest_book_info.css","./images/pbase-agerantum.png",
		"./images/pbase-abeliophyllum.jpg", "./images/pbase-agerantum.jpg",
		"./images/animated-flower-image-0021.gif","./html/guest_comment_iframe.html"
		];
	var url = req.url.split('?')[0];
	var filename = req.url.length>1&&"."+url||"./html/index.html";
	console.log("url=>"+url+"\nfilename==>",filename,"\n ==========",req.method)
	if(req.method=='POST'){
		var name = ''; var comment = '';
		req.on('data',function(data){
			requestData+=data;
			name = querysString.parse(requestData).name;
			comment = querysString.parse(requestData).comment;
		});
		req.on('end',function(){
			var time = new Date().toString().substr(0,24)
			var dataToBeAdded = "<div class='guest_comment'><h>"+time+"</h><div><h>Name:</h><div id='name'>"+name+"</div></div><div><h>Comment:</h><div id='comment'>"+comment+"</div></div></div>";
			var fileData = fs.readFileSync("./html/guest_comment_iframe.html",'utf-8').split(/\n\r|\n\t|\n/);
			fileData.splice(26,0,dataToBeAdded)
			fs.writeFileSync("./html/guest_comment_iframe.html",fileData.join('\n'));
			res.writeHead(301,{date: new Date(),'content-type': 'text/html',
			  'content-length': fileData.length,connection: 'close',Location:"../html/guest_book.html"});
			res.end()
		})
	}
	else if(myFiles.indexOf(filename)!=-1){
		var text = fs.readFileSync(filename)
		res.write(text);
		res.end();
	}
	else {
		res.write("<html><head><body><h style='ont-size:30px;'>Error 404</h></body></head></html>");
		res.end()
	}
}
http.createServer(requestHandler).listen(4000,function(){
	console.log("Hello I'm listening at port 4000");
});
