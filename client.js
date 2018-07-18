var net = require('net');
var command;
var parameter = "";

for(var i = 3;i < process.argv.length; i++){
	
	if(process.argv[i] !== undefined){
		var param = process.argv[i];
		parameter += param.toString();
		
		if(i+1 !== process.argv.length){
			parameter += " ";
		}
	}
}
if(process.argv[2] !== undefined ){
	command = process.argv[2];
} else {
	command = "help";
}

var client = new net.Socket();
client.connect(32297, '127.0.0.1', function(){	
	var executor = parameter === "" ? command : command + " " + parameter;
	client.write(executor);
});
client.on('data', function(data) {
	var output = new Buffer(data);
	output = output.toString();
	console.log(output);
	setTimeout(function () {client.destroy();},1000);
});

client.on('error', function(err){
	console.log("Error: "+ err.message);
});
