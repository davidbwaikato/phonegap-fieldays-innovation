

var DiscoverView = function(scan_mode) {

    this.scan_mode = scan_mode;

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
        var self = this;

		if(!result.text) { // empty
			app.showAlert("No innovation story loaded", self.scan_mode + ": No value found"); //alert("No innovation story loaded");				
			app.reroute("#kiaora"); // back to previous page
			return;
		}
		if(!(/^Innovation-Story-\d\d$/).test(result.text)) { // http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
			app.showAlert("Not an innovation story", self.scan_mode + ": Unrecognised value"); //alert(result.text + " is not an innovation story");
			app.reroute("#kiaora"); // back to previous page
			return;
		}
			
		var innovation_id = "#"+result.text+"-tpl";
		var innovation_html = $(innovation_id).html();

		var inner_template = Handlebars.compile(innovation_html);
		var inner_html     = inner_template(self.homeView);

		// Record the fact that the user has brought up this innovation story
		KiaoraView.explored_stories[result.text] = 1;

		$('#info-page').html(inner_html);	

    };


    this.qrScan = function() {
        var self = this;

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


        cordova.plugins.discoverScanAR.scan( // qr scan
	        $.proxy(this.loadInnovationStory,this),
                function (error) {
                    app.showAlert(err,"Scanning failed: ");
                }
        );
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
                    app.showAlert(err,"Scanning failed: ");
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

