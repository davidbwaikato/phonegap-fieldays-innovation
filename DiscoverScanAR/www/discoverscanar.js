/**
 * cordova is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Matt Kane 2010
 * Copyright (c) 2011, IBM Corporation
 */

    var ScannerLoader = function (require, exports, module) {

        var exec = require("cordova/exec");

        /**
         * Constructor.
         *
         * @returns {DiscoverScanAR}
         */
        function DiscoverScanAR() {

            /**
             * Encoding constants.
             *
             * @type Object
             */
            this.Encode = {
                TEXT_TYPE: "TEXT_TYPE",
                EMAIL_TYPE: "EMAIL_TYPE",
                PHONE_TYPE: "PHONE_TYPE",
                SMS_TYPE: "SMS_TYPE"
                //  CONTACT_TYPE: "CONTACT_TYPE",  // TODO:  not implemented, requires passing a Bundle class from Javascript to Java
                //  LOCATION_TYPE: "LOCATION_TYPE" // TODO:  not implemented, requires passing a Bundle class from Javascript to Java
            };
        };

        /**
         * Read code from scanner.
         *
         * @param {Function} successCallback This function will recieve a result object: {
         *        text : '12345-mock',    // The code that was scanned.
         *        format : 'FORMAT_NAME', // Code format.
         *        cancelled : true/false, // Was canceled.
         *    }
         * @param {Function} errorCallback
         */
        DiscoverScanAR.prototype.scan = function (successCallback, errorCallback) {
            if (errorCallback == null) {
                errorCallback = function () {
                };
            }

            if (typeof errorCallback != "function") {
                console.log("DiscoverScanAR.scan failure: failure parameter not a function");
                return;
            }

            if (typeof successCallback != "function") {
                console.log("DiscoverScanAR.scan failure: success callback parameter must be a function");
                return;
            }

            exec(successCallback, errorCallback, 'DiscoverScanAR', 'scan', []);
        };



        DiscoverScanAR.prototype.arscan = function (json_file,successCallback, errorCallback) {
            if (errorCallback == null) {
                errorCallback = function () {
                };
            }

            if (typeof errorCallback != "function") {
                console.log("DiscoverScanAR.arscan failure: failure parameter not a function");
                return;
            }

            if (typeof successCallback != "function") {
                console.log("DiscoverScanAR.arscan failure: success callback parameter must be a function");
                return;
            }

            exec(successCallback, errorCallback, 'DiscoverScanAR', 'arscan', [ {"jsonFile": json_file}]);
        };


        //-------------------------------------------------------------------
        DiscoverScanAR.prototype.encode = function (type, data, successCallback, errorCallback, options) {
            if (errorCallback == null) {
                errorCallback = function () {
                };
            }

            if (typeof errorCallback != "function") {
                console.log("DiscoverScanAR.encode failure: failure parameter not a function");
                return;
            }

            if (typeof successCallback != "function") {
                console.log("DiscoverScanAR.encode failure: success callback parameter must be a function");
                return;
            }

            exec(successCallback, errorCallback, 'DiscoverScanAR', 'encode', [
                {"type": type, "data": data, "options": options}
            ]);
        };

        var discoverScanAR = new DiscoverScanAR();
        module.exports = discoverScanAR;

    }

    ScannerLoader(require, exports, module);

    cordova.define("cordova/plugin/DiscoverScanAR", ScannerLoader);




