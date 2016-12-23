var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

//var url = 'mongodb://localhost:27017/url_db'
var url = 'mongodb://sample:sample@ds113608.mlab.com:13608/url_db'


app.listen(port, function(){
	console.log('url shortener app is running on port ' + port);
})

MongoClient.connect(url, function(err, db){
	if (err) {
		console.log('Unable to connect to mongoDB server, error: ', err);
	} else {
		console.log('Connection established to ', url);

		var collection = db.collection('redirect');

		app.get('*', function(req, res){

			var uri = req.url;
			var input = uri.toString().substring(1, uri.toString().length); //remove the first slash

			if (input.substring(0,4) == 'new/'){
				var target = input.substr(4); //target to redirect to
				var rand = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;

				var row = {
					stamp: rand, 
					target: target
				}

				collection.insert(row, function(err, result){
					if (err) { 
						console.log(err);
					} else {
						console.log('Inserted %d documents into the "redirect" collection. the document inserted with "_id" is ', result.length, result); 
					}
					//db.close();
				})


				res.send('shortened url ' + target + ' to ' + req.get('host') + '/' + rand + '|' );
				


			} else {
				collection.find({stamp: Number(input)}).toArray(function(err, result){
					var redir = '';
					if(err){
						console.log(err);
					} else if (result.length) {
						console.log('found');
						result.forEach(function(val){
                           console.log(val.target);
                           redir = val.target;
                           res.redirect(redir);
						})
						
					} else {
						console.log('No documents found');
					}
					
					db.close();
					//res.send('redirects to ' +  input + ' | '  + redir);
				})
				
			}
			
		})


		
	}
})