exports.deviceid = function (callback) {

	//Include
	var request = require('request'); 
	var querystring = require('querystring');
	var fs = require('fs');
	var ini = require('ini');
	
	//Declare Variables
	var access_token;
	var targetname;
	var deviceid;
	var msg;
	
	// Reads Access_token
	var tokens = ini.parse(fs.readFileSync('./tokens.ini', 'utf-8'));
	access_token = tokens.tokens.access_token;
	
	//Reads Targetname
	var config = ini.parse(fs.readFileSync('./config.ini','utf-8'));
	targetname = config.userdata.targetname;

	// requesting deviceID from access token
	var authOptions = {
	  url: 'https://api.spotify.com/v1/me/player/devices',
	  headers: { 'Authorization': 'Bearer ' + access_token },
	  json: true
	};
	
	request.get(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) { 
			msg = 'Getting new DeviceID.';
			
			for (var device = 0; device < body.devices.length; device++){
				if(targetname === body.devices[device].name){
					deviceid = body.devices[device].id;
					config.userdata.device_id = deviceid;
					fs.writeFileSync('./config.ini', ini.stringify(config));

				} 
			}
		} else {
			msg = 'Http-Error: '+ response.statusCode + ' occured!';
			}
		return callback(msg);
	});	
};