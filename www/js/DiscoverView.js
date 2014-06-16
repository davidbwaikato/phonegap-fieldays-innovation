

var DiscoverView = function(scan_mode, homeView) {

    this.scan_mode = scan_mode;
	this.homeView = homeView;
	
    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
    };

    this.setScanMode = function(scan_mode) {
		this.scan_mode = scan_mode;
    };

    this.render = function() {
		if (!this.homeView) {
			this.homeView = { enteredName:  "" }
		}

		var discover_view = DiscoverView.template(this.homeView);
		this.el.html(discover_view);

		//this.qrScan();

        return this;
    };
	
	/*
	this.story_lookup = {
		'Innovation-Story-01': "Innovation Story 1, testing, testing, testing",
		'Innovation-Story-02': "Innovation Story 2, foo-bar, foo-bar, foo-bar"
	};*/


    this.loadInnovationStory = function(result) {
		//console.error("LoadInnovationStory: " + result.text);
		
        var self = this;

		//alert("LoadInnovationStory: " + result.text); console.error("LoadInnovationStory: checkpt 1" );
		
		if(!result.text) { // empty
			app.showAlert("No innovation story loaded", self.scan_mode + ": No value found"); //alert("No innovation story loaded");				
			app.reroute("#kiaora"); // back to previous page
			return;
		}
		
		
		var story_id = result.text;
		var myRegexp = /^(?:webpage:)?(Innovation-Story-\d\d)$/;
		var match = myRegexp.exec(story_id);
		
		if(match.length != 2) { // first match match[0] is the entire regex, the second match is Innovation-Story-DD
			app.showAlert("Not an innovation story |" + result.text + "|", self.scan_mode + ": Unrecognised value"); //alert(result.text + " is not an innovation story");						
			app.reroute("#kiaora"); // back to previous page
			return;
		} else { 
			story_id = match[1];			
			//app.showAlert("story_id is now: " + story_id);
		}		
		
		/*
		if(!(/^(webpage:)?(Innovation-Story-\d\d)$/).test(result.text)) { // http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
			app.showAlert("Not an innovation story " + result.text, self.scan_mode + ": Unrecognised value"); //alert(result.text + " is not an innovation story");
			app.reroute("#kiaora"); // back to previous page
			return;
		}*/		
		
		//console.error("@@@@ FOUND AR/QR: " + result.text + " " + story_id);
		//alert("@@@@ FOUND AR/QR: " + result.text + " " + story_id);
		
		var innovation_id = "#"+story_id+"-tpl";
		var innovation_html = $(innovation_id).html();

		var inner_template = Handlebars.compile(innovation_html);
		var inner_html     = inner_template(self.homeView);

		// Record the fact that the user has brought up this innovation story
		KiaoraView.explored_stories[story_id] = 1;

		//$('#info-page').empty(); // http://stackoverflow.com/questions/2648618/remove-innerhtml-from-div
		//$('#info-page').html("<body style='background-color: #632468';></body>");
		$('#info-page').html(inner_html);
		
		// log the story they found
		app.homePage.writeEntryToLog("story", story_id);

    };


    this.qrScan = function() {
        var self = this;
//$('#info-page').empty();
		
        console.log('qrScan(): init');
        // documentation said the syntax was this:
        // var scanner = window.PhoneGap.require("cordova/plugin/BarcodeScanner");
        // but playing with options, seems like it should be this:
        //var scanner = window.cordova.require("cordova/plugin/BarcodeScanner");

		if (!window.cordova) {
            console.log("DiscoverView.qrScan(): QR-Code Scanner not supported, defaulting to Story 1");
			this.loadInnovationStory({text: "Innovation-Story-01"});
            return;
        }

		//alert("Before QR scanning");
		//console.error("Before QR scanning");
		
        cordova.plugins.discoverScanAR.scan( // qr scan
	        $.proxy(this.loadInnovationStory,this),
                function (error) {
                    app.showAlert(error,"Scanning failed: ");
					//alert("QR Scanning failed: " + error);
                }
        );
		
		//alert("After QR scanning");
    };


    this.arScan = function() {

        var self = this;

        console.log('arScan(): init');

		if (!window.cordova) {
            console.log("DiscoverView.arScan(): Discover AR Scanner not supported, defaulting to Story 2");
			this.loadInnovationStory({text: "Innovation-Story-02"});
            return;
        }

		cordova.plugins.discoverScanAR.arscan(
			"fieldays.json",
			$.proxy(this.loadInnovationStory,this),
                function (error) {
                    app.showAlert(error,"Scanning failed: ");
					//alert("AR Scanning failed: " + error);
                }
        );

    };

    this.scan = function() {
		if (this.scan_mode.toLowerCase() == "ar") {
			this.arScan();
		}
		else {
			this.qrScan();
		}
    }

    this.initialize();

}

DiscoverView.template = Handlebars.compile($("#discover-tpl").html());

