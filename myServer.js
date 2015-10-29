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
			var time = new Date().toString().substr(0,24)
			var dataToBeAdded = "<div class='comment_section'><div id='time_added'>"+time+"</div><div><h3>Name:</h3><div id='name_added'>"+name+"</div></div><div><h3>Comment:</h3><div id='comment_added'>"+comment+"</div></div></div>newComment";
			fs.appendFileSync('./guest_book_data.text',dataToBeAdded,'utf-8');
			var closingTag = "</div></div></body></html>";
			var fileData = fs.readFileSync(filename,'utf-8').split(/\n\r|\n\t|\n/).slice(0,18);
			var commentData = fs.readFileSync('./guest_book_data.text','utf-8').split(/newComment/).reverse();
			commentData.push(closingTag)
			var text = fileData.concat(commentData).join('\n\r');
			fs.writeFileSync(filename,text);
			var presentableContent = fs.readFileSync(filename)
			res.write(presentableContent)
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
