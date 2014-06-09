var FinishView = function(homeView) {

	this.homeView = homeView;	

	this.reinitialize = function() {		
	}
	
    this.initialize = function() {		
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
		
		this.reinitialize();
    };

    this.render = function() {
        this.el.html(FinishView.template());
        return this;
    };
	
	this.fileWriteSuccess = function() {
		console.log("successfully wrote file: " + this.recordsFile);		
	}
	
	this.getLogName = function () {
		return this.recordsFile;
	}
	
	
    this.initialize();

}

FinishView.template = Handlebars.compile($("#finish-tpl").html());

