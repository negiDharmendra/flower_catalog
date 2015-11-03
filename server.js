var http = require('http');
var fs  = require('fs');
var EventsEmitter = require('events').EventEmitter;
var emitter = new EventsEmitter();

var getHandler = [
	{path:'^/$', handler:serveDefaultFile},
	{path:'', handler:serveAllFile},
	{path:'', handler:fileNotFound}
];

var match_URL_patterns = function(url){
	return function(handler){
		return url.match(new RegExp(handler.path,'g'));
	};
};

emitter.on('next',function(handler,req,res,next){
	if(handler.length==0) return
	var pathHandlers = handler.shift();
	console.log("pathHandlers===>",pathHandlers)
	pathHandlers.handler(req,res,next)
})

var all_get_handler = function(req,res){
	var get_handler = getHandler.filter(match_URL_patterns(req.url));
	function next(){
		emitter.emit('next',get_handler,req,res,next);
	};
	next();
}

var requestHandler = function(req,res){
	console.log("url==>",req.url)
	console.log("method==>",req.method)
	if(req.method=="POST"){
		all_post_handler(req,res)
	}
	else if(req.method=="GET"){
		all_get_handler(req,res)
	}
}
function fileNotFound(req,res,next){
	res.writeHead(405)
	console.log(res.statusCode+"\n-------------------------------------------------------");
	res.end("<html><head><title></title></head><body><h>File Not Found</h></body></html>")
}

function serveDefaultFile(req,res,next){
	fs.readFile('./html/index.html','utf-8',function(err,data){
		res.writeHead(200,{contentLength:data.length})
		console.log(res.statusCode+"\n-------------------------------------------------------");
		res.end(data);
	})
}

function serveAllFile(req,res,next){
	fs.readFile('.'+req.url,function(err,data){
		if(data){
			res.writeHead(200,{contentLength:data.length})
			console.log(res.statusCode+"\n-------------------------------------------------------");
			res.end(data);
		}
		else{
			next()
		}
	})
}
http.createServer(requestHandler).listen(3000, function(){
	console.log("Server is started at port \"3000\"")
});