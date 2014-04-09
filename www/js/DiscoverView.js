

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
        this.el.html(discover);

	this.scan();

        return this;
    };


    this.scan = function() {
        var self = this;

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
		    
		    var inner_template = Handlebars.compile($("#"+result.text+"-tpl").html());
		    var inner_html     = inner_template(self.homeView);

		    $('#info-page').html(inner_html);

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

