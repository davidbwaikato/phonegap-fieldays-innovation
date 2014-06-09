var HomeView = function() {
	
    this.enteredName = "";
	
	// READ FROM FILE
	this.viewControlFilename = "tipple-store/fdi-control.json"; // stored in /sdcard
	
	// WRITE TO FILE
	this.recordsFile = "tipple-store/fdrecords"; /* Default name, will be suffixed with date "_dd-mm-yyyy" */
	
	this.initLogFileName = function() {		
		// set the name to use for the log file we write to
		var date = new Date();
		var d = date.getDate(); // 1-31
		var m = date.getMonth() + 1; // 0-11
		var y = date.getFullYear();
		this.recordsFile = this.recordsFile + "_" + d + "-" + m + "-" + y + ".txt";		
		delete date;
	};
	
	// call this to re-read the control file. KiaoraPage will call this
	this.readControlFile = function() {
		if (this.fileSystem) {	
			
			this.fileIO.readFile(this.viewControlFilename,
					$.proxy(this.readScanMode, this), 
					$.proxy(this.failGeneral, this) );
		}	
	};
	
    this.reinitialize = function() {
		var self = this;
        this.el.on('keyup', '#enter-name', function() { self.activateStart(self) });		
		
		// FILE READ	
		this.readControlFile();
		
		// FILE WRITE
		// set the name to use for the log file we write to
		this.initLogFileName();
		
    };


    this.initialize = function() {
		var self = this;
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
		this.el.on('keyup', '#enter-name', function() { self.activateStart(self) });
		
		
		// FILE READ
		// LocalFileSystem.PERSISTENT = /sdcard on Android
		var fileSystemType = (window.cordova) ? LocalFileSystem.PERSISTENT : window.PERSISTENT;		
		
		if (window.cordova) { // only try reading the control file for the scanMode value if this is a phonegap application
			// Note: The file system has been prefixed as of Google Chrome 12:
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
		
			window.requestFileSystem(fileSystemType, 1024, 
								 $.proxy(this.onFileSystemSuccess, this), 
								 $.proxy(this.failGeneral, this));
		} // else using browser. It will default scanMode to "qr" in main.js
		
		// FILE WRITE
		this.initLogFileName();	
		
		//alert("Log name: " + this.recordsFile);
		
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
		
		// can't write name to log here, the name trickles in a letter at a time in this function
    };

	this.playVideo = function(callback) {
		
		if (typeof VideoPlayer != 'undefined') {
			VideoPlayer.play('file:///android_asset/www/video/startupVideo1Android.mp4',callback);
		}
		else {
			console.log("HomePage: No VideoPlayer plugin.  Going straight to callback()");
			callback();
		}
		
		/*
		if (window.plugins.html5Video) {
			window.plugins.html5Video.play("startupVideo1");
		}*/
		
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
	
	// ******************* END OF FILE READ FUNCTIONS ****************** //
	
	/******************* START WRITING TO FILE *******************/
	this.writeToLog = function() {
		// http://stackoverflow.com/questions/9614357/cant-get-phone-gap-in-android-to-give-me-the-current-time

		var date = new Date();
		
		// pad the times with a 0 prefix before constructing the timestamp
		var seconds = date.getSeconds();
		if(seconds < 10) { seconds = "0" + seconds; } 
		var mins = date.getMinutes();
		if(mins < 10) { mins = "0" + mins; } 
		var hours = date.getHours();
		if(hours < 10) { mins = "0" + hours; } 
		
		var record = { 
			// "timestamp" : date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(), //date,
			"timestamp" : hours + ":" + mins + ":" + seconds,
			"enteredName" : this.homeView.enteredName, 
			"q1" : this.homeView.q1,
			"q2" : this.homeView.q2,
			"q3" : this.homeView.q3
		};
		
		delete date; // no longer using it
		
		var text = JSON.stringify(record) + "\n";
		
		if(window.cordova) {
			if(!this.fileSystem) {			
				console.error("ERROR. Could not write file " + this.recordsFile);
			}
			else {
				console.log ("Writing record: " + text);
				this.fileIO.writeFile(this.recordsFile, text, $.proxy(this.fileWriteSuccess, this));
			}
		} else {
			console.log("Browser context. Record: " + text);
		}
	
	};
	
	this.writeEntryToLog = function(field, value) {
		//alert("Logging to: " + this.recordsFile);	
		
		var date = new Date();
		
		// pad the times with a 0 prefix before constructing the timestamp
		var seconds = date.getSeconds();
		if(seconds < 10) { seconds = "0" + seconds; } 
		var mins = date.getMinutes();
		if(mins < 10) { mins = "0" + mins; } 
		var hours = date.getHours();
		if(hours < 10) { hours = "0" + hours; }		
		
		var record = {
			"timestamp" : hours + ":" + mins + ":" + seconds
		};		
		record[field] = value;  // only way to set the name of the field to a variable instead of the string literal "field"
								// http://stackoverflow.com/questions/10055919/jquery-json-how-to-define-key-from-variable
		delete date;
		
		var text = JSON.stringify(record) + "\n";		
		if(window.cordova) {
			if(!this.fileSystem) {
				console.error("ERROR. Could not write entry to file " + this.recordsFile);
			}
			else {
				console.log ("Writing record entry: " + text);
				this.fileIO.writeFile(this.recordsFile, text, $.proxy(this.fileWriteSuccess, this));
			}
		} else {
			console.log("Browser context. Record entry: " + text);
		}
	};
	
	/******************* END WRITING TO FILE *******************/
	
    this.initialize();

}

HomeView.template = Handlebars.compile($("#home-tpl").html());

