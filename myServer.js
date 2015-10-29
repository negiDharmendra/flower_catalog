var http = require('http');
var fs = require('fs');
var querysString = require("querystring")
function requestHandler(req,res){
	var requestData='';
	var myFiles = [
		"./abeliophyllum.html", "./ageratum.html", "./guest_book.html", "./index.html",
		"./abeliophyllum_info.css", "./ageratum_info.css", "./index.css","./guest_book_info.css","./pbase-agerantum.png",
		"./pbase-abeliophyllum.jpg", "./pbase-agerantum.jpg","./animated-flower-image-0021.gif"
		]
	var url = req.url.split('?')[0];
	var filename = req.url.length>1&&"."+url||"./index.html";
	if(req.method=='POST'){
		var name = ''; var comment = '';
		req.on('data',function(data){
			requestData+=data;
			name = querysString.parse(requestData).name;
			comment = querysString.parse(requestData).comment;
		});
		req.on('end',function(){
			var dataToBeAdded = "<p>"+new Date()+"</p></br>"+"<p>"+name+"</p></br>"+"<p>"+comment+"</p></br></br>";
			fs.appendFileSync('./guest_book.html',dataToBeAdded)
			var text = fs.readFileSync(filename)
			res.write(text)
			res.end()
		})
	}
	else if(myFiles.indexOf(filename)!=-1){
		var text = fs.readFileSync(filename)
		res.write(text);
		res.end();
	}
	else res.end()
}
http.createServer(requestHandler).listen(4000,function(){
	console.log("Hello I'm listening at port 4000");
});
