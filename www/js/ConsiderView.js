

var ConsiderView = function(homeView) {

    this.homeView = homeView;

    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
    };

    this.render = function() {
	if (!this.homeView) {
	    this.homeView = { enteredName:  "" }
	}
        this.el.html(ConsiderView.template(this.homeView));

        return this;
    };

    this.crossfade = function(delay) {
	var self = this;

	$("#svg-bubbles-div").delay(delay).animate({ opacity: 0 }, 700);
	$("#after-bubbles").delay(delay).css("display","block").animate({ opacity: 1 }, 700);
    };


    this.initialize();
}

ConsiderView.template = Handlebars.compile($("#consider-tpl").html());

