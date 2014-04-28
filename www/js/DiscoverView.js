

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


    this.story_lookup = { 
	'Innovation-Story-01': "Innovation Story 1, testing, testing, testing",
	'Innovation-Story-02': "Innovation Story 2, foo-bar, foo-bar, foo-bar"
    };

    this.loadInnovationStory = function(result) {
        var self = this;

	var innovation_id = "#"+result.text+"-tpl";
	var innovation_html = $(innovation_id).html();

	var inner_template = Handlebars.compile(innovation_html);
	var inner_html     = inner_template(self.homeView);
	//var inner_html = this.story_lookup[result.text];

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
            console.log("DiscoverView.qrScan(): Barcode Scanner not supported, defaulting to Story 1");
	    this.loadInnovationStory({text: "Innovation-Story-01"});
            return;
        }


        cordova.plugins.discoverScanAR.scan( // qr scan
	        self.loadInnovationStory,
                function (error) {
                    app.showAlert(err,"Scanning failed: ");
                }
        );
    };


    this.arScan = function() {

        var self = this;

        console.log('arScan(): init');

	if (!window.cordova) {
            app.showAlert("Discover AR Scanner not supported", "Error");
            return;
        }


      cordova.plugins.discoverScanAR.arscan(
	  function(success) {
            alert("AR scan success: " + success.text);
          }, function(fail) {
            alert("AR scan failed: " + fail);
          }
        );

    };

    this.scan = function() {
	if (this.scan_mode == "ar") {
	    this.arScan();
	}
	else {
	    this.qrScan();
	}
    }

    this.initialize();

}

DiscoverView.template = Handlebars.compile($("#discover-tpl").html());

