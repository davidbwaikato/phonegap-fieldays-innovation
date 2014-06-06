var FinishView = function(homeView, kiaoraView) {

	this.homeView = homeView;
	this.kiaoraView = kiaoraView;
	this.recordsFile = "tipple-store/fdrecords"; /* Default name, will be suffixed with date "_dd-mm-yyyy" */
	

	this.reinitialize = function() {
		// set the name to use the data
		var date = new Date();
		var d = date.getDate(); // 1-31
		var m = date.getMonth() + 1; // 0-11
		var y = date.getFullYear();
		this.recordsFile = this.recordsFile + "_" + d + "-" + m + "-" + y + ".txt";		
		delete date;
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

	this.writeToLog = function() {
		// http://stackoverflow.com/questions/9614357/cant-get-phone-gap-in-android-to-give-me-the-current-time

		var date = new Date();
		
		var record = { 
			"timestamp" : date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(), //date, 
			"enteredName" : this.homeView.enteredName, 
			"q1" : this.homeView.q1,
			"q2" : this.homeView.q2,
			"q3" : this.homeView.q3
		};
		
		delete date; // no longer using it
		
		var text = JSON.stringify(record) + "\n";
		
		if(window.cordova) {
			if(!this.kiaoraView.fileSystem) {			
				console.error("ERROR. Could not write file " + this.recordsFile);
			}
			else {
				console.log ("Writing record: " + text);
				this.kiaoraView.fileIO.writeFile(this.recordsFile, text, $.proxy(this.fileWriteSuccess, this));
			}
		} else {
			console.log("Browser context. Record: " + text);
		}
	
	}
	
	this.fileWriteSuccess = function() {
		console.log("successfully wrote file: " + this.recordsFile);		
	}
	
	this.getLogName = function () {
		return this.recordsFile;
	}
	
	
    this.initialize();

}

FinishView.template = Handlebars.compile($("#finish-tpl").html());

