

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

    this.crossfade = function() {
	$("#svg-bubbles-div").animate({ opacity: 0 }, 700);
	$("#after-bubbles").css("display","block").animate({ opacity: 1 }, 700);
    };


    this.initialize();
}

StartView.template = Handlebars.compile($("#start-tpl").html());

