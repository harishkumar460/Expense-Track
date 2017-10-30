package org.apache.cordova.customplugin;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.widget.Toast;

public class TestPlugin extends CordovaPlugin {
	 Context context; 
	@Override
     public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("showMessage")) {
             String message = "Message from java";//args.getString(0);
             this.echo(message, callbackContext);
             return true;
         }
        else if(action.equals("showToast")){
        	this.showToast(args.getString(0));
        	return true;
        }
         return false;
     }
	 private void echo(String message, CallbackContext callbackContext) {
         if (message != null && message.length() > 0) {
             callbackContext.success(message);
         } else {
             callbackContext.error("Expected one non-empty string argument.");
         }
         
     }
	 private void showToast(String msg){
		 context = this.cordova.getActivity().getApplicationContext(); 
		 CharSequence text =msg+"!";
		 int duration = Toast.LENGTH_SHORT;

		 Toast toast = Toast.makeText(context, text, duration);
		 toast.show();
	 }

}
