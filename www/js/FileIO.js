var FileIO = function(fileSystem) {

	this.fileSystem = fileSystem;

	// http://stackoverflow.com/questions/10294166/how-to-check-a-files-existence-in-phone-directory-with-phonegap
	// http://stackoverflow.com/questions/13286233/javascript-pass-function-as-parameter
	
	this.failIOFail = function(error) {
		console.error("File IO failure: code='" + error.code + "', message=" + error.message);		
    };
	

	// ******************* START OF FILE READ FUNCTIONS ****************** //
	this.readFile = function(filename, successCallback, optFailureCallback) {	
		var self = this;
		var failureCallback =  optFailureCallback || $.proxy(this.failIOFail, this);
		
		// 1. Look to see if the file given by filename exists
		// 2. if it does, read it in
		this.fileSystem.root.getFile(filename, 
								null, //(this.mode == "READ") ? { create: false } : null, 
								function(fileEntry) { self.gotFileEntry(fileEntry, successCallback, failureCallback); },
								failureCallback );
						
	};
	
	
	this.writeFile = function(filename, text, successCallback, optFailureCallback) {

		var self = this;		
		var failureCallback = optFailureCallback || $.proxy(this.failIOFail, this);
		
		this.fileSystem.root.getFile(filename, {create: true, exclusive: false}, 
									function(fileEntry) { self.fileEntryWritable(fileEntry, text, successCallback, failureCallback); },
									failureCallback);
	};
	
	
    this.fileEntryWritable = function(fileEntry, text, successCallback, failureCallback) {
		var self = this;
		
        fileEntry.createWriter(
			function(writer) { self.writeFileInternal(writer, text, successCallback, failureCallback); }, //$.proxy(this.writeControlFile,this), 
			$.proxy(this.failGeneral,this) );
    };
	
	this.writeFileInternal = function(writer, text, successCallback, failureCallback) {
		var self = this;
		
		writer.onwrite = function(evt) {
			console.log("FileIO.writeFileInternal(): successfully saved " + writer.fileName);
			console.log("FileIO.writeFileInternal(): Have written out " + text);
			
			//console.log("In FileIO.write. writing: " + text);		
			
			successCallback();
		};
		
		writer.onerror = function(fileTransferError) {
			console.error("FileIO.writeFileInternal(): failed to save " + writer.fileName);			
			failureCallback(fileTransferError);
		};
		
		writer.seek(writer.length); // to append text
		writer.write(text);		
	};	
	
	/*
	this.getFileForReading = function(fileSystem, filename) {	
		
		// Read (or refresh) values from the control file
		// The line initiates the following sequence:
		// 1. Look to see if the file given by filename exists
		// 2. if it does, read it in
		fileSystem.root.getFile(filename, { create: false }, 
								$.proxy(this.gotFileEntry, this), 
								$.proxy(this.noFileEntry, this) );
						
	};*/	

	this.gotFileEntry = function(fileEntry, successCallback, failureCallback) {
		var self = this;		
		
		fileEntry.file(
				function(file) { self.readFileInternal(file, successCallback, failureCallback); },
				failureCallback);
		
	};
	
	this.readFileInternal = function(file, successCallback, failureCallback){	
		var reader = new FileReader();
        reader.onloadend = function(evt) {
			
			// don't test for "== null", use either the test "obj === null" or the test "!obj"
			// http://saladwithsteve.com/2008/02/javascript-undefined-vs-null.html
			if(!evt.target.result) {
				console.log("FileIO.readFile() ERROR: File empty!");
				
			} else {
				var textRead = evt.target.result;
				successCallback(textRead);
				
				// http://www.mikeyd.com.au/2009/06/04/executing-javascript-anonymous-function-stored-in-a-variable/
			}
		};
		
        reader.readAsText(file);			
    };
	// ******************* END OF FILE READ FUNCTIONS ****************** //
	
	//this.initialize();
}


