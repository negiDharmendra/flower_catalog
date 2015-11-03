var http = require('http');
var fs = require('fs');
var querysString = require("querystring")
function requestHandler(req,res){
	var requestData='';
	var filename = req.url.length>1&&"."+req.url||"./html/index.html";
	console.log("url=>"+filename+"\n ==========",req.method)
	if(req.method=='POST'){
		var name = ''; var comment = '';
		req.on('data',function(data){
			requestData+=data;
			name = querysString.parse(requestData).name;
			comment = querysString.parse(requestData).comment;
		});
		req.on('end',function(){
			var time = new Date().toString().substr(0,24)
			var dataToBeAdded = "<div class='guest_comment'><h>"+time+"</h><div><h>Name:</h>"+
			"<div id='name'>"+name+"</div></div><div><h>Comment:</h><div id='comment'>"+comment+"</div></div></div>";
			var fileData = fs.readFileSync("./html/guest_comment_iframe.html",'utf-8').split(/\n\r|\n\t|\n/);
			fileData.splice(26,0,dataToBeAdded)
			fs.writeFileSync("./html/guest_comment_iframe.html",fileData.join('\n'));
			res.writeHead(301,{date: new Date(),'content-type': 'text/html',
			  'content-length': fileData.length,connection: 'close',Location:"../html/guest_book.html"});
			res.end()
		})
	}
	fs.readFile(filename,function(err,data){
		if(err){
			res.statusCode=404;
			res.end();
			return;
		}
		res.statusCode=200;
		res.end(data);
	});
}
http.createServer(requestHandler).listen(4000,function(){
	console.log("Hello I'm listening at port 4000");
});
