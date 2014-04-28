

var KiaoraView = function(homeView) {

    this.homeView = homeView;

    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
    };

    this.render = function() {
	if (!this.homeView) {
	    this.homeView = { enteredName:  "" }
	}
        this.el.html(KiaoraView.template(this.homeView));

        return this;
    };


    this.initialize();
}

KiaoraView.template = Handlebars.compile($("#kiaora-tpl").html());

