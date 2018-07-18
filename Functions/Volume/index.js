exports.volume = function(volume,callback) {
	
	//Include
	var request = require('request'); 
	var querystring = require('querystring');
	var fs = require('fs');
	var ini = require('ini');

	//Declares Variables
	var access_token;
	var deviceid;
	var playtype;
	var msg = "test";
	var value;

	// Reads Access_token
	var tokens = ini.parse(fs.readFileSync('./tokens.ini', 'utf-8'));
	access_token = tokens.tokens.access_token;

	//Reads DeviceID
	var config = ini.parse(fs.readFileSync('./config.ini','utf-8'));
	deviceid = config.userdata.device_id;
	
	//Requests Skip on Device
	
	var authOptions = {
		url: 'https://api.spotify.com/v1/me/player/volume?&volume_percent=' + volume + '&device_id=' + deviceid +'',
		headers: { 'Authorization': 'Bearer ' + access_token },
		json: true
	};
	
	var run = function (){
		request.put(authOptions,function (error,response) {
			if (!error && response.statusCode === 204) {
				msg = "Setting Volume to " + volume + ".";
			} else {
				msg= 'Http-Error: '+ response.statusCode + ' occured!';
			}
			return callback( msg );
		});
	};
 run();


};