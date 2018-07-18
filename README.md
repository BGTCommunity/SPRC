# SpotifyRemoteControl - Command Line

## Requirements
1. You need nodejs and nodejs-legacy to be installed.
2. Do "npm install".

## Install
1. Go to https://developer.spotify.com/my-applications/ and log in.
2. Click on "Create an app".
3. Choose a name and description for your application and click save.
4. Keep the side open, you will need your client id and client secret later.
5. Open the config.ini and write the client id, client secret and name of the target-PC in.
6. Now you can close the application window.
7. Run sprc.sh with parameter install for first use.

## Troubleshooting
1. If the bashscript return "Server already running" and ECONNREFUSED please remove the sprc.pid and start again.
2. Please report any bugs that might occure to the developers.