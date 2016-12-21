var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

app.get('/', function(req, res){
	res.send('url shortener project');
})


app.listen(port, function(){
	console.log('url shortener app is running on port ' + port);
})