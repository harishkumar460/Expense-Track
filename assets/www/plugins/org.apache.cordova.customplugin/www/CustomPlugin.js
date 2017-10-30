var plugins={
	callPlugin:function(successCallback,errorCallback,serviceName,serviceAction,args){
	cordova.exec(successCallback, errorCallback, serviceName, serviceAction, args);
        },
        showToast:function(toastInformation){
            this.callPlugin(function(msg){
		console.log('Toast response done'+msg);    
		},function(err){
		    console.log('error from toast function '+err);
		},"TestPlugin", "showToast",[toastInformation]);    
        },
        speechText:function(){
            this.callPlugin(function(){
		console.log('Response in plugin speechText success');    
		},function(err){
		    console.log('error from speechText plugin '+err);
		},"TextSpeechPlugin", "Speech",[]);  
        },
        speechTextStop:function(){
            this.callPlugin(function(){
		console.log('Response in plugin speechTextStop success');    
		},function(err){
		    console.log('error from speechTextStop plugin '+err);
		},"TextSpeechPlugin", "SpeechStop",[]);  
        },
        speechTextInit:function(){
            this.callPlugin(function(){
		console.log('Response in plugin speechTextInit success');    
		},function(err){
		    console.log('error from speechTextInit plugin '+err);
		},"TextSpeechPlugin", "initSpeech",[]);  
        }
};

