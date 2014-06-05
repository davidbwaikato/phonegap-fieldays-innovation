var SplashView = function() {

    this.initialize = function() {		
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
		
    };

    this.render = function() {
        this.el.html(SplashView.template());
        return this;
    };
	
    this.initialize();

}

SplashView.template = Handlebars.compile($("#splash-tpl").html());

