exports.uri = function(urisList,callback) {

	//Include
	var request = require('request'); 
	var querystring = require('querystring');
	var fs = require('fs');
	var ini = require('ini');
	
	//Declares Variables
	var access_token;
	var deviceid;
	var uristype;
	var authOptions;
	var urislist;
	var msg;
	var uris = [];
	
	//Reads Access_token
	var tokens = ini.parse(fs.readFileSync('./tokens.ini', 'utf-8'));
	access_token = tokens.tokens.access_token;
	
	//Reads DeviceID
	var config = ini.parse(fs.readFileSync('./config.ini','utf-8'));
	deviceid = config.userdata.device_id;
	
	function sorturis() {
		if(typeof urisList === 'string'){
			uris = [urisList];
		} else {
			uris = urisList;
		}
		
		if(uris[0].indexOf("album") !== -1 || uris[0].indexOf("artist") !== -1 || uris[0].indexOf("playlist") !== -1  ){
			uristype = {"context_uri":uris[0]};
			config.userdata.playtype = "context";
		} else if(uris[0].indexOf("track") !== -1){
			uristype = {"uris":uris};
			config.userdata.playtype = "track";
		} else {
			msg = "Keine gültige Uri.";
		}
		fs.writeFileSync('./config.ini', ini.stringify(config));
		
	}
	
	sorturis();
	
	//Requests Playing a track by uris
	
	authOptions = {
		url: 'https://api.spotify.com/v1/me/player/play?device_id=' + deviceid,
		headers: { 'Authorization': 'Bearer ' + access_token },
		body: uristype,
		json: true
	};
	request.put(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 204) { 	
			msg = "Playing the track by uris!";
		} else {
			msg = 'Http-Error: '+ response.statusCode + ' occured!';
			
		}
		return callback( msg );
	});
};