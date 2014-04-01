var StartView = function(homeView) {

    this.homeView = homeView;

    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
    };

    this.render = function() {
	if (this.homeView) {
            this.el.html(StartView.template(this.homeView));
	}
	else {
            this.el.html(StartView.template());
	}
        return this;
    };

    this.initialize();

}

StartView.template = Handlebars.compile($("#start-tpl").html());
