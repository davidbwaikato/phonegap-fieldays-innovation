

var StartView = function(homeView) {

    this.homeView = homeView;

    this.initialize = function() {
        // 'div' wrapper to attach html and events to
        this.el = $('<div/>');

	this.el.on('click', '.scanner-btn', this.scan);

    };

    this.render = function() {
	if (!this.homeView) {
	    this.homeView = { enteredName:  "" }
	}
        this.el.html(StartView.template(this.homeView));

        return this;
    };

    this.crossfade = function() {
	$("#svg-bubbles-div").delay(20000).animate({ opacity: 0 }, 700);
	$("#after-bubbles").delay(20000).animate({ opacity: 1 }, 700);
    };



    this.scan = function() {
        console.log('scan(): init');
        // documentation said the syntax was this:
        // var scanner = window.PhoneGap.require("cordova/plugin/BarcodeScanner");
        // but playing with options, seems like it should be this:
        //var scanner = window.cordova.require("cordova/plugin/BarcodeScanner");

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

StartView.template = Handlebars.compile($("#start-tpl").html());

