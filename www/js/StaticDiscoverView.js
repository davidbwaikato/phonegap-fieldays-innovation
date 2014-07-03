// Static discover page. Used by the web browser version of the app
// Provides a static list of innovation stories to choose from
var StaticDiscoverView = function(homeView) {

	this.homeView = homeView;	

	//this.reinitialize = function() {}
	
    this.initialize = function() {		
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
		
		//this.reinitialize();
    };

    this.render = function() {
        this.el.html(StaticDiscoverView.template());
        return this;
    };
	
    this.initialize();

}

StaticDiscoverView.template = Handlebars.compile($("#static-discover-tpl").html());

