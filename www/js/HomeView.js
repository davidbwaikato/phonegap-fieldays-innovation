var HomeView = function(store) {

    this.enteredName = "";

    this.reinitialize = function() {
	var self = this;
        this.el.on('keyup', '#enter-name', function() { self.activateStart(self) });
    };


    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
	this.reinitialize();
    };

    this.render = function() {
        this.el.html(HomeView.template());
        return this;
    };

    this.activateStart = function(self) {
	// in this function 'this' refers to the HTML element where keyup event occured

	var entered_name = $('#enter-name').val();
	if (entered_name.match(/^\s*$/)) {
	    // empty or all white-space
	    $('#start').prop('disabled',true);
	}
	else {
	    $('#start').prop('disabled',false);
	}
	self.enteredName = entered_name;
    };

    this.initialize();

}

HomeView.template = Handlebars.compile($("#home-tpl").html());
