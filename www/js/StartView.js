

var StartView = function(homeView) {

    this.homeView = homeView;

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

	var url = this.getPhoneGapPath() + 'audio/eab-innovation.wav';

	var snd = new Media(url, function () { console.log("playAudio():Audio Success"); },
			         function (err) { console.log("playAudio():Audio Error: " + err); }
			   );
	
	// Play audio
	snd.play();

    };


    this.crossfade = function(delay) {
	$("#svg-bubbles-div").delay(delay).animate({ opacity: 0 }, 700);
	$("#after-bubbles").delay(delay).css("display","block").animate({ opacity: 1 }, 700);

	this.playAudio();
    };


    this.initialize();
}

StartView.template = Handlebars.compile($("#start-tpl").html());

