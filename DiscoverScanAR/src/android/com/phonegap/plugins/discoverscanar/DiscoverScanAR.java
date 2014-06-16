/**
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Matt Kane 2010
 * Copyright (c) 2011, IBM Corporation
 * Copyright (c) 2013, Maciej Nux Jaros
 */
package com.phonegap.plugins.discoverscanar;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;

/**
 * This calls out to the ZXing barcode reader and returns the result.
 *
 * @sa https://github.com/apache/cordova-android/blob/master/framework/src/org/apache/cordova/CordovaPlugin.java
 */
public class DiscoverScanAR extends CordovaPlugin {
    public static final int REQUEST_SCAN_CODE = 0x0ba7c0de;
    public static final int REQUEST_ARSCAN_CODE = 0x0ba7c0df;

    private static final String SCAN = "scan";
    private static final String ARSCAN = "arscan";
    private static final String ENCODE = "encode";
    private static final String CANCELLED = "cancelled";
    private static final String FORMAT = "format";
    private static final String TEXT = "text";
    private static final String DATA = "data";
    private static final String TYPE = "type";
	private static final String JSONFILE = "jsonFile";
    private static final String SCAN_INTENT = "com.phonegap.plugins.discoverscanar.SCAN";
    private static final String ENCODE_DATA = "ENCODE_DATA";
    private static final String ENCODE_TYPE = "ENCODE_TYPE";
    private static final String ENCODE_INTENT = "com.phonegap.plugins.discoverscanar.ENCODE";
    private static final String TEXT_TYPE = "TEXT_TYPE";
    private static final String EMAIL_TYPE = "EMAIL_TYPE";
    private static final String PHONE_TYPE = "PHONE_TYPE";
    private static final String SMS_TYPE = "SMS_TYPE";

    private static final String LOG_TAG = "DiscoverScanAR";

    private CallbackContext callbackContext;

    /**
     * Constructor.
     */
    public DiscoverScanAR() {
    }

    /**
     * Executes the request.
     *
     * This method is called from the WebView thread. To do a non-trivial amount of work, use:
     *     cordova.getThreadPool().execute(runnable);
     *
     * To run on the UI thread, use:
     *     cordova.getActivity().runOnUiThread(runnable);
     *
     * @param action          The action to execute.
     * @param args            The exec() arguments.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return                Whether the action was valid.
     *
     * @sa https://github.com/apache/cordova-android/blob/master/framework/src/org/apache/cordova/CordovaPlugin.java
     */
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        this.callbackContext = callbackContext;

        if (action.equals(ENCODE)) {
            JSONObject obj = args.optJSONObject(0);
            if (obj != null) {
                String type = obj.optString(TYPE);
                String data = obj.optString(DATA);

                // If the type is null then force the type to text
                if (type == null) {
                    type = TEXT_TYPE;
                }

                if (data == null) {
                    callbackContext.error("User did not specify data to encode");
                    return true;
                }

                encode(type, data);
            } else {
                callbackContext.error("User did not specify data to encode");
                return true;
            }
        } else if (action.equals(SCAN)) {
			
			// Section threading of http://docs.phonegap.com/en/2.3.0/guide_plugin-development_android_index.md.html
			// But it still displayed the error "Plugin should use CordovaInterface.getThreadPool"
			cordova.getThreadPool().execute(new Runnable() {
			//CordovaInterface.getThreadPool().execute(new Runnable() {
				public void run() {
					scan();
				}
			});	
        } else if (action.equals(ARSCAN)) {
			JSONObject obj = args.optJSONObject(0);
			// If the type is null then force the type to text
			final String json_file = (obj != null) ? obj.optString(JSONFILE) : null;
            /*
			final String json_file = null;
			if (obj != null) {
                json_file = obj.optString(JSONFILE);

                // If the type is null then force the type to text
			}*/
			if (json_file != null) {
				cordova.getThreadPool().execute(new Runnable() {
				//CordovaInterface.getThreadPool().execute(new Runnable() {
					public void run() {
						arscan(json_file);
					}
				});
			}
			else {
				callbackContext.error("User did not specify a json file to load");
			}
        } else {
            return false;
        }
        return true;
    }

    /**
     * Starts an intent to scan and decode a barcode.
     */
    public void scan() {
        Intent intentScan = new Intent(SCAN_INTENT);
        intentScan.addCategory(Intent.CATEGORY_DEFAULT);

        this.cordova.startActivityForResult((CordovaPlugin) this, intentScan, REQUEST_SCAN_CODE);
    }


    public void arscan(String json_file) {

	Intent intentARScan = new Intent(); 
	intentARScan.setAction(Intent.ACTION_VIEW); 
	
	if (json_file == null) {
		json_file = "hamilton.json";
	}
		
	// Used to be hardwired to: "http://www.cs.waikato.ac.nz/~davidb/tipple/uni-mixare-locdata.json"
	intentARScan.setDataAndType(Uri.parse("file:///sdcard/tipple-store/geodata/" + json_file), "application/mixare-json"); 
        this.cordova.startActivityForResult((CordovaPlugin) this, intentARScan, REQUEST_ARSCAN_CODE);
    }


    /**
     * Called when the barcode scanner intent completes.
     *
     * @param requestCode The request code originally supplied to startActivityForResult(),
     *                       allowing you to identify who this result came from.
     * @param resultCode  The integer result code returned by the child activity through its setResult().
     * @param intent      An Intent, which can return result data to the caller (various data can be attached to Intent "extras").
     */
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
	
		// logging goes to logcat. LOG.d for debug(), LOG.e for error()
		// http://www.vogella.com/tutorials/AndroidLogging/article.html
		//Log.d(LOG_TAG, "#### onActivityResult");
	
        if (requestCode == REQUEST_SCAN_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put(TEXT, intent.getStringExtra("SCAN_RESULT"));						
                    obj.put(FORMAT, intent.getStringExtra("SCAN_RESULT_FORMAT"));
                    obj.put(CANCELLED, false);
					this.callbackContext.success(obj);
					Log.e(LOG_TAG, "#### Found text: " + intent.getStringExtra("SCAN_RESULT") + " AND Called callback on success" );
                } catch (JSONException e) {
                    Log.d(LOG_TAG, "This should never happen");
					this.callbackContext.error("Scan intent. Unexpected error: " + e.getMessage());
                }
                //this.success(new PluginResult(PluginResult.Status.OK, obj), this.callback);
                //this.callbackContext.success(obj);
            } else if (resultCode == Activity.RESULT_CANCELED) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put(TEXT, "");
                    obj.put(FORMAT, "");
                    obj.put(CANCELLED, true);
					
					//Log.e(LOG_TAG, "#### Found no text");
					
					this.callbackContext.success(obj);
                } catch (JSONException e) {
                    Log.d(LOG_TAG, "This should never happen");
					this.callbackContext.error("Scan intent. Unexpected error: " + e.getMessage());
                }
                //this.success(new PluginResult(PluginResult.Status.OK, obj), this.callback);
                //this.callbackContext.success(obj);
            } else {
                //this.error(new PluginResult(PluginResult.Status.ERROR), this.callback);
                this.callbackContext.error("Scan intent. Unexpected error");
            }
        }

        else if (requestCode == REQUEST_ARSCAN_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put(TEXT, intent.getStringExtra("ARSCAN_RESULT"));
                    obj.put(CANCELLED, false);
					this.callbackContext.success(obj);
                } catch (JSONException e) {
                    Log.d(LOG_TAG, "ARScan intent (RESULT_OK) threw an exception: This should never happen");
					this.callbackContext.error("ARScan intent. Unexpected error: " + e.getMessage());
                }
                //this.callbackContext.success(obj);
            } else if (resultCode == Activity.RESULT_CANCELED) {
                JSONObject obj = new JSONObject();
                try {
                    obj.put(TEXT, "");
                    obj.put(CANCELLED, true);
					this.callbackContext.success(obj);
                } catch (JSONException e) {
                    Log.d(LOG_TAG, "ARScan intent (RESULT_CANCELED) threw an exception. This should never happen");
					this.callbackContext.error("ARScan intent. Unexpected error: " + e.getMessage());
                }
                //this.callbackContext.success(obj);
            } else {
                //this.error(new PluginResult(PluginResult.Status.ERROR), this.callback);
                this.callbackContext.error("ARScan intent. Unexpected error");
            }
        }



    }

    /**
     * Initiates a barcode encode.
     *
     * @param type Endoiding type.
     * @param data The data to encode in the bar code.
     */
    public void encode(String type, String data) {
        Intent intentEncode = new Intent(ENCODE_INTENT);
        intentEncode.putExtra(ENCODE_TYPE, type);
        intentEncode.putExtra(ENCODE_DATA, data);

        this.cordova.getActivity().startActivity(intentEncode);
    }
}
