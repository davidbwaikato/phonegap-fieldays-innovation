

var StartView = function(homeView) {

    this.homeView = homeView;
	this.doCrossFade = true;
	
    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
    };

    this.render = function() {
	if (!this.homeView) {
	    this.homeView = { enteredName:  "" }
	}
        this.el.html(StartView.template(this.homeView));

        return this;
    };


    this.getPhoneGapPath = function() {

	var path = window.location.pathname;
	path = path.substr( path, path.length - 10 );
	return 'file://' + path;
    };

    this.playAudio = function() {

		if (window.cordova) {

			var url = this.getPhoneGapPath() + 'audio/eab-innovation.mp3';

			var snd = new Media(url, function () { console.log("playAudio():Audio Success"); },
								     function (err) { console.error("playAudio():Audio Error: " + err); }
					   );
			
			// Play audio
			snd.play();
		}
    };

	this.setCrossFade = function(doCrossFade) {
		this.doCrossFade = doCrossFade;
	}
	
	this.getCrossFade = function() {
		return this.doCrossFade;
	}

	this.playVideo = function(callback) {
		if (typeof VideoPlayer != 'undefined') {
			VideoPlayer.play('file:///android_asset/www/video/startupVideo2Android.mp4',callback);
		}
		else {
			console.log("StartPage: No VideoPlayer plugin.  Going straight to callback()");
			callback();
		}
	}
		
    this.crossfade = function(delay) {
		var self = this;

		$("#svg-bubbles-div").delay(delay).animate({ opacity: 0 }, 700);
		$("#after-bubbles").delay(delay).css("display","block").animate({ opacity: 1 }, 700);

		setTimeout(function() { self.playAudio(); }, 2000);
    };
	
	
    this.initialize();
}

StartView.template = Handlebars.compile($("#start-tpl").html());

