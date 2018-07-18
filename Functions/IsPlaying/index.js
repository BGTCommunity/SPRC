exports.isplaying = function (callback) {

	//Include
	var request = require('request'); 
	var querystring = require('querystring');
	var fs = require('fs');
	var ini = require('ini');
	
	//Declare Variables
	var access_token;
	var targetname;
	var playingstate;
	
	// Reads Access_token
	var tokens = ini.parse(fs.readFileSync('./tokens.ini', 'utf-8'));
	access_token = tokens.tokens.access_token;
	

	// requesting deviceID from access token
	var authOptions = {
	  url: ' 	https://api.spotify.com/v1/me/player',
	  headers: { 'Authorization': 'Bearer ' + access_token },
	  json: true
	};
	
	request.get(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) { 
			playingstate = body.is_playing;
			}
		return callback(playingstate);
	});	
};