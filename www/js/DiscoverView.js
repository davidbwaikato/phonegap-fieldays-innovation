

var DiscoverView = function() {

    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
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


    this.qrScan = function() {
        var self = this;

        console.log('qrScan(): init');
        // documentation said the syntax was this:
        // var scanner = window.PhoneGap.require("cordova/plugin/BarcodeScanner");
        // but playing with options, seems like it should be this:
        //var scanner = window.cordova.require("cordova/plugin/BarcodeScanner");

	if (!window.cordova) {
            app.showAlert("Barcode Scanner not supported", "Error");
            return;
        }

	var story_lookup = { 'Innovation-Story-01': "Innovation Story 1, testing, testing, testing",
			     'Innovation-Story-02': "Innovation Story 2, foo-bar, foo-bar, foo-bar"
			   };

	cordova.plugins.barcodeScanner.scan(
                function (result) {
		    
		    //var inner_template = Handlebars.compile($("#"+result.text+"-tpl").html());
		    //var inner_html     = inner_template.template(self.homeView);
		    var inner_html = story_lookup[result.text];

/*
                    app.showAlert("Result html: " + inner_html + "\n"
				  + "Format: " + result.format + "\n"
				  + "Cancelled: " + result.cancelled,
				  "Bar code");
*/

		    $('#info-page').html(inner_html);


                },
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


      cordova.plugins.discoverScanAR.arscan(function(success) {
            alert("AR scan success: " + success.text);
          }, function(fail) {
            alert("AR scan failed: " + fail);
          }
        );

    };


    this.initialize();







}

DiscoverView.template = Handlebars.compile($("#discover-tpl").html());

