

var Winner2013View = function(homeView) {

    this.homeView = homeView;

    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
    };

    this.render = function() {
	if (!this.homeView) {
	    this.homeView = { enteredName:  "" }
	}
        this.el.html(Winner2013View.template(this.homeView));

        return this;
    };


    this.initialize();
}

Winner2013View.template = Handlebars.compile($("#winner-2013-tpl").html());

Winner2013View.playVideo = function() {
    VideoPlayer.play('file:///android_asset/www/video/Kindling-Cracker.mp4');
};

