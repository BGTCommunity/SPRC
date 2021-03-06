exports.shuffle = function(toggle,callback){

	//Include
	var request = require('request'); 
	var querystring = require('querystring');
	var fs = require('fs');
	var ini = require('ini');

	//Declares Variables
	var access_token;
	var deviceid;
	var playtype;
	var state;
	var msg;

	// Reads Access_token
	var tokens = ini.parse(fs.readFileSync('./tokens.ini', 'utf-8'));
	access_token = tokens.tokens.access_token;

	//Reads DeviceID
	var config = ini.parse(fs.readFileSync('./config.ini','utf-8'));
	deviceid = config.userdata.device_id;
	
	//Reads State
	if(toggle){
		state = "true";
	} else if(!toggle){
		state = "false";
	}

	//Requests Skip on Device
	var authOptions = {
		url: 'https://api.spotify.com/v1/me/player/shuffle?device_id=' + deviceid +'&state=' + state,
		headers: { 'Authorization': 'Bearer ' + access_token },	
		json: true
	};

	request.put(authOptions, function(error, response, body) {
		
		if (!error && response.statusCode === 204) { 	
			
			msg = "Shuffling track.";
			
		} else {
			msg = 'Http-Error: '+ response.statusCode + ' occured!';
		}
		return callback(msg);
	});
};