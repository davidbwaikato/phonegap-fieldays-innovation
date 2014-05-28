

var KiaoraView = function(homeView) {

    this.homeView = homeView;

	this.viewControlFilename = "tipple-store/fdi-control.json"; // stored in /sdcard	
		
	
    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');		
		
		// LocalFileSystem.PERSISTENT = /sdcard on Android
		var fileSystemType = (window.cordova) ? LocalFileSystem.PERSISTENT : window.PERSISTENT;
		
		// FILE READ		
		//if (window.cordova) { // only try reading the control file for the scanMode value if this is a phonegap application
			// Note: The file system has been prefixed as of Google Chrome 12:
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
		
			window.requestFileSystem(fileSystemType, 1024, 
								 $.proxy(this.onFileSystemSuccess, this), 
								 $.proxy(this.failGeneral, this));
		//} // else using browser. It will default scanMode to "qr" in main.js
    };
	
	this.reinitialize = function() {
		var self = this;
		//if (this.fileSystem) {	
			
			this.fileIO.readFile(this.viewControlFilename,
					$.proxy(this.readScanMode, this), 
					$.proxy(this.failGeneral, this) );
		//}	
	};
	
	// ******************* START OF FILE READ FUNCTIONS ****************** //
	
	this.readScanMode = function(text) {
		// Read (or refresh) values from the control file
		// The line initiates the following sequence:
		// 1. Look to see if a JSON file storing the view controlling settings exists
		// 2. if it does, read it in, parse it with $.parseJson() and have it override 'this.viewControl' 
		
		var viewControl = jQuery.parseJSON(text);
		this.scanMode = viewControl.scanMode;
		
		// "A function returns undefined if a value was not returned"
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined		
	};
	
	this.failGeneral = function(error) {
		console.error("Fieldays Innovation failure: code='" + error.code + "', message=" + error.message);
    };

	this.onFileSystemSuccess = function(fileSystem) {
		// Record this so we can use it again in later functions
		var self = this;
		this.fileSystem = fileSystem;
		
		this.fileIO = new FileIO(fileSystem);
		
		console.log("File-system name = " + fileSystem.name);
        console.log("File-system root name = " + fileSystem.root.fullPath); // tends to be /
		
		this.fileIO.readFile(this.viewControlFilename,
						$.proxy(this.readScanMode, this), 
						$.proxy(this.failGeneral, this) );
    };
	
	this.getFile = function(fileSystem, filename) {	
		
		// Read (or refresh) values from the control file
		// The line initiates the following sequence:
		// 1. Look to see if a JSON file storing the view controlling settings exists
		// 2. if it does, read it in, parse it with $.parseJson() and have it override 'this.viewControl' 
		fileSystem.root.getFile(filename, null, 
								$.proxy(this.gotControlFileEntry, this), 
								$.proxy(this.noControlFileEntry, this) );
						
	};
	
	this.noControlFileEntry = function(error) { // no control file
		console.log("KiaoraView.noControlFileEntry() ERROR: No previously saved control data.");
		
	};
	
	this.gotControlFileEntry = function(fileEntry) {
		var self = this;
		fileEntry.file($.proxy(this.readControlFile,this), $.proxy(this.failGeneral,this));
	};
	
	this.readControlFile = function(file){
		var self = this;
		var reader = new FileReader();
        reader.onloadend = function(evt) {
			
			// don't test for "== null", use either the test "obj === null" or the test "!obj"
			// http://saladwithsteve.com/2008/02/javascript-undefined-vs-null.html
			if(!evt.target.result) {
				console.log("KiaoraView.readControlFile() ERROR: Control file empty!");				
			} else {
				//self.viewControl = jQuery.parseJSON(evt.target.result);
				var viewControl = jQuery.parseJSON(evt.target.result);
				self.scanMode = viewControl.scanMode;
			}
		};
		
        reader.readAsText(file);			
    };
	// ******************* END OF FILE READ FUNCTIONS ****************** //

    this.render = function() {
	if (!this.homeView) {
	    this.homeView = { enteredName:  "" }
	}

	var nes = Object.size(KiaoraView.explored_stories);

	if (nes > 0) {

	    this.homeView.numExploredStories = nes;
	    this.homeView.remainingStories = KiaoraView.totalNumStories - nes;

	    if (nes >= 1) { // #### should really be 4
		this.homeView.nowConsider= 1;
	    }
	}

        this.el.html(KiaoraView.template(this.homeView));

        return this;
    };


    this.initialize();
}

KiaoraView.template = Handlebars.compile($("#kiaora-tpl").html());

KiaoraView.totalNumStories = 5
KiaoraView.explored_stories = {};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
