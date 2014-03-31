var HomeView = function(store) {

    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
        this.el.on('keyup', '#enter-name', this.activateStart);
    };

    this.render = function() {
        this.el.html(HomeView.template());
        return this;
    };

    this.activateStart = function() {
	var $entered_name = $('#enter-name').val();
	if ($entered_name.match(/^\s*$/)) {
	    // empty or all white-space
	    $('#start').prop('disabled',true);
	}
	else {
	    $('#start').prop('disabled',false);
	}
    };

    this.initialize();

}

HomeView.template = Handlebars.compile($("#home-tpl").html());
