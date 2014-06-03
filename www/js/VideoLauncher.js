
failureHandler = function(error) {
	console.error("Error attempting to play video: code='" + error.code + "', message=" + error.message);		
};

playDirect = function(filePath) {
	if (typeof VideoPlayer != 'undefined') {
		VideoPlayer.play("file:///android_asset/www/video/" + filePath);
	}
	else {
		console.log("VideoLauncher.js: No VideoPlayer plugin.");
		
	}
}

playVideo = function(filePath, callback) {
	if (typeof VideoPlayer != 'undefined') {
		VideoPlayer.play("file:///android_asset/www/video/" + filePath, callback);
	}
	else {
		console.log("VideoLauncher.js: No VideoPlayer plugin.  Going straight to callback()");
		callback();
	}
}
