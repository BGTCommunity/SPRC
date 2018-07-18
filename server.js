var net = require('net');
var play = require('./Functions/Play/index.js');
var pause = require('./Functions/Pause/index.js');
var di = require('./Functions/DeviceId/index.js');
var at = require('./Functions/Accesstoken/index.js');
var uri = require('./Functions/Uri/index.js');
var skip = require('./Functions/Skip/index.js');
var previous = require('./Functions/Previous/index.js');
var repeat = require('./Functions/Repeat/index.js');
var volume = require('./Functions/Volume/index.js');
var authentification = require('./Functions/Authentification/index.js');
var shuffle = require('./Functions/Shuffle/index.js');
var playingstate = require('./Functions/IsPlaying/index.js');
var process = require('process');
var fs = require('fs');
var ini = require('ini');
var events = require('events');


//Declare variables
var message;
var output;
var refresh_token;
var arr = [];
var shuffleToggle = false;
var repeatToggle = false;
var isPlaying;
var commands = ["install", "play","pause","deviceid","accesstoken","uri","previous","skip","repeat","shuffle","volume","help","exit"];
events.EventEmitter.defaultMaxListeners = 10;


function access() {
	
	at.accesstoken(function(err,msg){
		if(err) {
			console.log(err);
		} else {
			message = msg;
			console.log(message);
		}
	});
}


//Write Process ID
fs.writeFileSync('./sprc.pid',process.pid);
//Create TCP-Server
var server = net.createServer(function(socket){

	var tokens = ini.parse(fs.readFileSync('./tokens.ini', 'utf-8'));
	refresh_token = tokens.tokens.refresh_token;
	if(refresh_token !== undefined){
		message = at.accesstoken(function(message){
			message = "";}
		);
	}
	socket.name = socket.remoteAddress + ":" + socket.remotePort;
	setInterval(function(){access();},340000);
	socket.on('data', function(result){
		var input = new Buffer(result).toString('utf-8');
		input = input.split(" ");
		
		if(commands.indexOf(input[0]) === -1) {
			socket.write("\nWrong parameter.\n\n");
			input[0] = "help";
		}
		playingstate.isplaying(function(message){
			isPlaying = message;
		});

		switch(input[0]) {
			case "install":
				socket.write('Webserver for Authorisation listening on http://localhost:8889 . Please click the link and authorise Spotify Remote Control.');
				message = authentification.authentification(function(message){
						socket.write(message);
				});
				break;
			case "play":
				if(isPlaying === false){
				message = play.play(function(message){
					socket.write(message);
				});
				}
				else{
					socket.write("Allready playing a song!");
				}
				break;
			case "pause":
				if(isPlaying === true){
				message = pause.pause(function(message){
					socket.write(message);
				});
				}
				else{
					socket.write("Allready paused!");
				}
				break;
			case "deviceid":
				message = di.deviceid(function(message){
					socket.write(message);
				});
				break;
			case "accesstoken":
				message = at.accesstoken(function(error,message){
					if(!error) {
						socket.write(message);
					}
				});
				break;
			case "uri":
				arr = [];
				for(var i=1; i < input.length; i++){
					arr.push(input[i]);
				}
				message = uri.uri(arr,function(message){
					socket.write(message);
				});
				break;
			case "skip":
				message = skip.skip(function(message){
					socket.write(message);
				});
				break;
			case "previous":
				message = previous.previous(function(message){
					socket.write(message);
				});
				break;
			case "shuffle":
				if(input[1] !== "true" && input[1] !== "false"){
					shuffleToggle = shuffleToggle ? false : true;
				} else {
					shuffleToggle = input[1] === "true" ? true : false;
				}
				message = shuffle.shuffle(shuffleToggle,function(message){
					socket.write(message);
				});
				break;
			case "repeat":
				if(input[1] !== "true" && input[1] !== "false"){
					repeatToggle = repeatToggle ? false : true;
				} else {
					repeatToggle = input[1] === "true" ? true : false;
				}
				message = repeat.repeat(repeatToggle,function(message){
					socket.write(message);
				});
				break;
			case "volume":
				volume.volume(input[1], function(message){
					socket.write(message);
				});
				break;
			case "help":
				socket.write("Spotify Remote Control - Command Line \n\nCommands:\nhelp - Shows this page.\ninstall - Authorises SpotifyRC\nplay - Plays the track.\npause - Pauses the track.\ndeviceid - Gets new DeviceID if you changed your device.\naccesstoken - Gets new accesstoken.\nuri [uri] - Plays track by uri.\nskip - Skips the track.\nprevious - Skips to the previous track.\nshuffle - Toggles shuffle.\nrepeat - Turns repeat on.\nvolume [percent] - Sets volume to your input.\nexit - Closes the service. ");
				break;
			case "exit":
				socket.write("Terminating...");
				process.exit();
				break;
		}
		input = null;
    });
	socket.on('error', function(err){
		console.log("Error: "+err.message);
	});
	process.on('exit', function(){fs.writeFileSync('./sprc.pid','');});
});
server.listen(32297,'127.0.0.1');