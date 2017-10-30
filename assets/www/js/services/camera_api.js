var pictureTargetId='';// target image container id for displaying captured or selected picture
var cameraAPI={
    pictureSource:'',   // picture source
    destinationType:'', // sets the format of returned value
    responseHandler:'',//callback function to revert back with response
    setpaths:function(targetId) { 
        this.pictureSource=navigator.camera.PictureSourceType;//set pictureSource path for choosing a picture
        this.destinationType=navigator.camera.DestinationType;// set destination type for storing an image
         pictureTargetId=targetId;// set destination type for storing an image
    },
   onPhotoDataSuccess:function(imageData) {//called when a picture captured successfully
      // Uncomment to view the base64 encoded image data
      document.getElementById('testDiv').innerHTML=imageData;
       plugins.showToast(imageData);
       // alert(imageData)
       //console.log(imageData);
       /*if(this.responseHandler){
	   this.responseHandler(imageData);   
       }*/
      var smallImage = document.getElementById(pictureTargetId);
      smallImage.style.display = 'block';
      
      smallImage.src =imageData;//"data:image/jpeg;base64," + imageData;
      smallImage.title=imageData;
      // $('#'+pictureTargetId).rotate(90);
    },
   onPhotoURISuccess:function(imageURI) {//called if picture will be saved in gallery
      // Uncomment to view the image file URI 
       console.log(imageURI);
      var largeImage = document.getElementById('largeImage');
      largeImage.style.display = 'block';
      largeImage.src = imageURI;
    },
    capturePhoto:function(targetId,callback){ // called when take picture event fires
	 plugins.showToast('called function');
	//this.responseHandler=callback;
       this.setpaths(targetId);
      // if(Android)
      // Android.setCamera();
       // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(this.onPhotoDataSuccess,this.onFail, { quality: 20,
        destinationType:this.destinationType.FILE_URI,saveToPhotoAlbum:true});
    },
    capturePhotoEdit:function() {//for testing purpose	
       this.setpaths();
        navigator.camera.getPicture(this.onPhotoDataSuccess,this.onFail, { quality: 20, allowEdit: false,
        destinationType:this.destinationType.DATA_URL,saveToPhotoAlbum:true});
    },
    getPhoto:function(callback) {//called when choose a picture event fire from user registration page
      this.setpaths();
      var source=this.pictureSource.PHOTOLIBRARY;
      // Retrieve image file location from specified source
      navigator.camera.getPicture(callback,this.onFail, { quality: 50, 
        destinationType:this.destinationType.FILE_URI,
        sourceType: source });
    },
    // Called if something bad happens.
   onFail:function(message) {
      console.log('Failed because: ' + message);
    }
};

