

var KiaoraView = function(homeView) {

    this.homeView = homeView;
	if(this.homeView) {
		this.homeView.totalNumStories = KiaoraView.totalNumStories;
	}
		
	
    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');		
		
    };
	
	this.reinitialize = function() {
		var self = this;
		
		// re-read the control file to get any changes to the scan mode
		if(this.homeView) { // homeView will be undefined on a clean browser re-load of the KiaoraPage
			this.homeView.readControlFile();
		}
	};
	

    this.render = function() {
	if (!this.homeView) {
	    this.homeView = { enteredName:  "" };
	}

	var nes = Object.size(KiaoraView.explored_stories);

	if (nes > 0) {

	    this.homeView.numExploredStories = nes;
	    this.homeView.remainingStories = KiaoraView.totalNumStories - nes;
		
		// Some fiddling for the interface
		if (this.homeView.foundAllStories) {
			delete this.homeView.foundAllStories;
		}
		if(this.homeView.remainingStories === 1) { // special case if there's only one story left to discover
			this.homeView.downToOneStory = 1;
		} else if (this.homeView.remainingStories === 0) {
			this.homeView.foundAllStories = 1;
			delete this.homeView.downToOneStory; // http://stackoverflow.com/questions/1596782/how-to-unset-a-javascript-variable
		}		
		
	    if (nes >= 3) { // #### should really be 4
		this.homeView.nowConsider= 1;
	    }
	}

        this.el.html(KiaoraView.template(this.homeView));

        return this;
    };
	
	// ************** START VIDEO FUNCTIONS *********************
	
	this.setCrossFade = function(doCrossFade) {
		this.doCrossFade = doCrossFade;
	}
	
	this.getCrossFade = function() {
		return this.doCrossFade;
	}

	this.playVideo = function(callback) {
		if (typeof VideoPlayer != 'undefined') {
			//VideoPlayer.play('file:///android_asset/www/video/startupVideo2Android.mp4',callback);
			VideoPlayer.play('file:///android_asset/www/video/animation.mp4',callback);
		}
		else {
			console.log("KiaoraPage: No VideoPlayer plugin.  Going straight to callback()");
			callback();
		}
	}
		
    this.crossfade = function(delay) {
		var self = this;

		$("#svg-bubbles-div").delay(delay).animate({ opacity: 0 }, 700);
		$("#after-bubbles").delay(delay).css("display","block").animate({ opacity: 1 }, 700);

		setTimeout(function() { self.playAudio(); }, 2000);
    };

	// ************** END VIDEO FUNCTIONS *********************

    this.initialize();
}

KiaoraView.template = Handlebars.compile($("#kiaora-tpl").html());

KiaoraView.totalNumStories = 3;
KiaoraView.explored_stories = {};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
