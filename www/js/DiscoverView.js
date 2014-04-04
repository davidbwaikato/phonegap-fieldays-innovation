

var DiscoverView = function() {

    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');
    };

    this.render = function() {
	if (!this.homeView) {
	    this.homeView = { enteredName:  "" }
	}
        this.el.html(DiscoverView.template(this.homeView));

	this.scan();
        return this;
    };


    this.scan = function() {
        console.log('scan(): init');
        // documentation said the syntax was this:
        // var scanner = window.PhoneGap.require("cordova/plugin/BarcodeScanner");
        // but playing with options, seems like it should be this:
        //var scanner = window.cordova.require("cordova/plugin/BarcodeScanner");

	if (!window.cordova) {
            app.showAlert("Barcode Scanner not supported", "Error");
            return;
        }

	cordova.plugins.barcodeScanner.scan(
                function (result) {
                    app.showAlert("Result: " + result.text + "\n"
				  + "Format: " + result.format + "\n"
				  + "Cancelled: " + result.cancelled,
				  "We got a barcode");
                },
                function (error) {
                    app.showAlert(err,"Scanning failed: ");
                }
        );
    };

    this.initialize();







}

DiscoverView.template = Handlebars.compile($("#discover-tpl").html());

