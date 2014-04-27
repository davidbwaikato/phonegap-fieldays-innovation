DiscoverScanAR
==============

Discover AR and/or QR Codes for Cordova / PhoneGap.

Based on BarcodeScanner phonegap plugin

Follows the [Cordova Plugin spec]
(https://github.com/apache/cordova-plugman/blob/master/plugin_spec.md),
so that it works with [Plugman]
(https://github.com/apache/cordova-plugman).

Note: the Android source for this project includes an Android Library Project.
plugman currently doesn't support Library Project refs, so its been
prebuilt as a jar library. Any updates to the Library Project should be
committed with an updated jar.

## Using the plugin ##
The plugin creates the object `cordova/plugin/DiscoverScanAR` with the method `scan(success, fail)`. 

The following barcode types are currently supported:
### Android

* QR_CODE
* DATA_MATRIX
* UPC_E
* UPC_A
* EAN_8
* EAN_13
* CODE_128
* CODE_39
* CODE_93
* CODABAR
* ITF
* RSS14
* PDF417
* RSS_EXPANDED

`success` and `fail` are callback functions. Success is passed an
object with data, type and cancelled properties. Data is the text
representation of the barcode data, type is the type of barcode
detected and cancelled is whether or not the user cancelled the scan.

A full example could be:
```
   cordova.plugins.discoverScanAR.scan(
      function (result) {
          alert("We got a location\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
```


## Licence ##

GPLv3
