

var KiaoraView = function(homeView) {

    this.homeView = homeView;

	this.viewControlFilename = "tipple-store/fdi-control.json"; // stored in /sdcard
	
    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
		
		// FILE READ
		// Note: The file system has been prefixed as of Google Chrome 12:
		window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
		
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024, // LocalFileSystem.PERSISTENT = /sdcard on Android
								 $.proxy(this.onFileSystemSuccess, this), 
								 $.proxy(this.failGeneral, this));
    };
	
	this.reinitialize = function() {
		this.getFile(this.fileSystem, this.viewControlFilename);
	}
	
	// ******************* START OF FILE READ FUNCTIONS ****************** //
	this.failGeneral = function(error) {
		console.error("Fieldays Innovation failure: code='" + error.code + "', message=" + error.message);
    };

	this.onFileSystemSuccess = function(fileSystem) {
		// Record this so we can use it again in later functions
		this.fileSystem = fileSystem;
		
        console.log("File-system name = " + fileSystem.name);
        console.log("File-system root name = " + fileSystem.root.fullPath); // tends to be /
		
		this.getFile(this.fileSystem, this.viewControlFilename);
    };
	
	this.getFile = function(fileSystem, filename) {	
		
		// Read (or refresh) values from the control file
		// The line initiates the following sequence:
		// 1. Look to see if a JSON file storing the view controlling settings exists
		// 2. if it does, read it in, parse it with $.parseJson() and have it override 'this.viewControl' 
		fileSystem.root.getFile(filename, null, 
								$.proxy(this.gotControlFileEntry, this), 
								$.proxy(this.noControlFileEntry, this) );
						
	}
	
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

	    if (nes >= 2) {
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
