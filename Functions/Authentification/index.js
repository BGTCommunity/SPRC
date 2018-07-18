exports.authentification = function(callback) {


	var express = require('express'); // Express web server framework
	var request = require('request'); // "Request" library
	var querystring = require('querystring');
	var cookieParser = require('cookie-parser');
	var fs = require('fs');
	var ini = require('ini');
	
	var client_id;
	var client_secret;
	var redirect_uri;
	var access_token;
	var refresh_token;
	var server;
	var message;
	
	var tokens = ini.parse(fs.readFileSync('./tokens.ini', 'utf-8'));
	
	//reads userdata
	var config = ini.parse(fs.readFileSync('./config.ini','utf-8'));
	client_id = config.userdata.client_id;
	client_secret = config.userdata.client_secret;
	redirect_uri = config.userdata.redirect_uri;
	
	var generateRandomString = function(length) {
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	
		for (var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};

	var stateKey = 'spotify_auth_state';
	var app = express();

	app.use(express.static(__dirname + '/web'))
		.use(cookieParser());

	app.get('/login', function(req, res) {
	  var state = generateRandomString(16);
	  res.cookie(stateKey, state);

	  // your application requests authorization
	  var scope = 'playlist-read-private user-modify-playback-state user-read-playback-state';
	  res.redirect('https://accounts.spotify.com/authorize?' +
	    querystring.stringify({
	      response_type: 'code',
	      client_id: client_id,
	      scope: scope,
	      redirect_uri: redirect_uri,
	      state: state
	    }));
	});


	app.get('/callback', function(req, res) {

	  // your application requests refresh and access tokens
	  // after checking the state parameter

	  var code = req.query.code || null;
	  var state = req.query.state || null;
	  var storedState = req.cookies ? req.cookies[stateKey] : null;

	  if (state === null || state !== storedState) {
	    res.redirect('/#' +
	      querystring.stringify({
	        error: 'state_mismatch'
	      }));
	  } else {
	    res.clearCookie(stateKey);
	    var authOptions = {
	      url: 'https://accounts.spotify.com/api/token',
	      form: {
	        code: code,
	        redirect_uri: redirect_uri,
	        grant_type: 'authorization_code'
	      },
	      headers: {
	        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
	      },
	      json: true
	    };

	    request.post(authOptions, function(error, response, body) {
	      if (!error && response.statusCode === 200) {

	    	  access_token = body.access_token;
	          refresh_token = body.refresh_token;
	            
	          setTimeout(function config() {
	          tokens.tokens.access_token = access_token;
	          tokens.tokens.refresh_token = refresh_token;
	          fs.writeFileSync('./tokens.ini', ini.stringify(tokens));
	       },2000);
	            message = "Authentification sucessfully.";

	        var options = {
	          url: 'https://api.spotify.com/v1/me',
	          headers: { 'Authorization': 'Bearer ' + access_token },
	          json: true
	        };

	        // use the access token to access the Spotify Web API
	        request.get(options);

	        // we can also pass the token to the browser to make requests from there
	        res.redirect('/#' +
	          querystring.stringify({
	            access_token: access_token,
	            refresh_token: refresh_token
	          }));
	      } else {
	    	message = "An error occured.";
	        res.redirect('/#' +
	          querystring.stringify({
	            error: 'invalid_token'
	          }));
	      }
	      
	      });
	    return callback(message);
	  }
	});
	app.get('/logout',function(){
		server.close();
	});

	try{
		server = app.listen(8889);
	} catch(error) {
		return error;
	}
};