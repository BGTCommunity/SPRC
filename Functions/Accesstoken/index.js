exports.accesstoken = function (callback) {
	
	var request = require('request');
	var querystring = require('querystring');
	var fs = require('fs');
	var ini = require('ini');
	
	//Declare Variables
	var client_id;
	var client_secret;
	var redirect_uri;
	var buffer;
	var access_token;
	var refresh_token;
	var error;
	var msg;
	
	//Reads Userdata
	var config = ini.parse(fs.readFileSync('./config.ini','utf-8'));
	
	client_id = config.userdata.client_id;
	client_secret = config.userdata.client_secret;
	redirect_uri = config.userdata.redirect_uri;
	
	// Reads Refresh_token
	var tokens = ini.parse(fs.readFileSync('./tokens.ini', 'utf-8'));
	refresh_token = tokens.tokens.refresh_token;
		
	 // requesting access token from refresh token
	 var authOptions = {
	 url: 'https://accounts.spotify.com/api/token',
	 headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
	 	form: {
	 		grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	};
	request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			access_token = body.access_token;
			msg = "Accesstoken generated.";
		} else {
			msg = "Http-Error: "+ response.statusCode + " occured!";
			
		}
		return callback(msg);
	});
	
	function wac(){  
		tokens.tokens.access_token = access_token;
	    fs.writeFileSync('./tokens.ini', ini.stringify(tokens));
	}
	
	setTimeout(function(){wac();},1000);        
};
	    	