package org.apache.cordova.customtextspeech;

import java.util.Locale;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.speech.tts.TextToSpeech;
import android.widget.Toast;

public class TextSpeechPlugin extends CordovaPlugin{
	TextToSpeech t1;
	Context context;
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("Speech")) {
        	textToSpeech();
        	callbackContext.success();
             return true;
         }
        else if(action.equals("SpeechStop")){
        	try{
        		t1.shutdown();
        		callbackContext.success();
            	return true;
        	}catch(Exception e){
        		callbackContext.error("test");
            	return true;	
        	}
        }
        else if(action.equals("initSpeech")){
        	initTextSpeech();	
        }
         return false;
     }
  private void textToSpeech(){
	    //try{
	    	 CharSequence text ="Hello";
			 int duration = Toast.LENGTH_LONG;
			 Toast toast = Toast.makeText(context, text, duration);
			 toast.show();
			 t1.speak(text, TextToSpeech.QUEUE_FLUSH,null,"");	
	    //}catch(Exception e){
	    //	System.out.println("Error in text speech");
	    //}
  }
  private void initTextSpeech(){
	  context = this.cordova.getActivity().getApplicationContext();
	  t1=new TextToSpeech(context, new TextToSpeech.OnInitListener() {
	         @Override
	         public void onInit(int status) {
	            if(status != TextToSpeech.ERROR) {
	               t1.setLanguage(Locale.UK);
	            }
	         }
	      });	  
  }
}