var http = require('http');
var fs  = require('fs');
var querystring = require('querystring');
var EventsEmitter = require('events').EventEmitter;
var emitter = new EventsEmitter();

var getHandler = [
	{path:'^/$', handler:serveDefaultFile},
	{path:'', handler:serveAllFile},
	{path:'', handler:fileNotFound}
];

var postHandler = [
	{path:'', handler:postGivenDataIntoRelevantFile},
	{path:'', handler:methodNotAllowed}
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
};

var all_post_handler = function(req,res){
	var post_handler = postHandler.filter(match_URL_patterns(req.url));
	function next(){
		emitter.emit('next',post_handler,req,res,next);
	};
	next();
};

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
//==================================GET=======================================================
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
		else next();
	})
};
//==================================POST=======================================================
function maintainDataBase(data){
	var dataBase = fs.existsSync('./data/comment.json')&&JSON.parse(fs.readFileSync('./data/comment.json','utf-8'))||[];
	dataBase.unshift(data);
	var jsonData = JSON.stringify(dataBase)
	fs.writeFileSync('./data/comment.json',jsonData);
};

function parepareHtml(comment){
	var time = new Date().toString().substr(0,24)
	return "<div class='guest_comment'><h>"+time+"</h><div><h>Name:</h>"+
			"<div id='name'>"+comment.name+"</div></div><div><h>Comment:</h><div id='comment'>"+comment.comment+"</div></div></div>"
}

function postGivenDataIntoRelevantFile(req,res,next){
	var data = '';
	req.on('data',function(chunk){
		data+=chunk;
		data = querystring.parse(data);
	})
	req.on('end',function(){
		maintainDataBase(data)
		var commentData = JSON.parse(fs.readFileSync('./data/comment.json','utf-8'));
		var dataToBeAdded = commentData.map(parepareHtml)
		var fileData = fs.readFileSync("./html/guest_comment_iframe.html",'utf-8').split(/\n\r|\n\t|\n/);
		fileData.splice(26,0,dataToBeAdded.join('\n'))
		fs.writeFileSync("./html/guest_comment_iframe.html",fileData.join('\n'));
		res.writeHead(301,{date: new Date(),'content-type': 'text/html',
		  'content-length': fileData.length,connection: 'close',Location:"../html/guest_book.html"});
		res.end()
	})
};

function methodNotAllowed(req,res,next){
	res.writeHead(404);
	console.log(res.statusCode+"\n-------------------------------------------------------");
	res.end("This"+ req.method+" method is not allowed for this link.")
}

http.createServer(requestHandler).listen(3000, function(){
	console.log("Server is started at port \"3000\"")
});