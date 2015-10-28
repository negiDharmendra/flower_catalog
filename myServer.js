var http = require('http');
var fs = require('fs');
function requestHandler(req,res){
	var filename = req.url.length>1&&"./"+req.url.substr(1)||"./index.html";
	var text = fs.readFileSync(filename,"utf-8")
	// console.log(res.writeHead(200,{'Content-Length': text.length,'Content-Type': 'text/plain' }));
	// console.log("heelo I'm headers",req.rawHeaders);
	// console.log("heelo I'm url",req.method);
	// console.log("heelo I'm clintserver",req.connection.remoteAddress)
	// console.log("heelo I'm clintserver",req.url)
	res.write(filename);
	res.end()
}
http.createServer(requestHandler).listen(4000,function(){
	console.log("Hello I'm listening at port 4000");
});
